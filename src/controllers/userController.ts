import UserService from '../services/userService';
import bcrypt from 'bcrypt';
import Express from 'express';
import { matchedData } from 'express-validator';
import { IUser } from '../interfaces/user';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import {
  getAllUsersDto,
  getProfileDto,
  getUserDto,
  loginDto,
  refreshTokenDto,
  registerDto,
  removeUserDto,
} from '../interfaces/dto/userDtos';

const userService = new UserService();

interface MongoError {
  index: string;
  code: number;
  keyPattern: unknown;
  keyValue: unknown;
}

export class UserController {
  public async register(req: Express.Request, res: Express.Response) {
    const { username, password } = <registerDto>matchedData(req);
    if (password && username) {
      const hashed = await bcrypt.hash(password, 10);
      try {
        const user = await userService.createUser(username, hashed);
        return res.status(201).send(user);
      } catch (err: MongoError | unknown) {
        if ((<MongoError>err).code === 11000) {
          return res.status(StatusCodes.BAD_REQUEST).send('User already exists');
        } else {
          console.log(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
        }
      }
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send('Missing username or password');
    }
  }

  public async login(
    req: Express.Request,
    res: Express.Response,
  ): Promise<Express.Response<{ accessToken: string; refreshToken: string }>> {
    try {
      const { username, password } = <loginDto>matchedData(req);
      const user = <IUser>await userService.getUser(username);

      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).send('Invalid credentials');
      }
      const isValid = await userService.comparePassword(password, user.password);
      if (isValid) {
        const newTokens = await userService.generateToken(user);
        return res.send(newTokens);
      } else {
        return res.status(StatusCodes.UNAUTHORIZED).send('Invalid credentials');
      }
    } catch (err) {
      console.log(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }

  public getProfile(req: Express.Request, res: Express.Response) {
    const { user } = <getProfileDto>matchedData(req);
    if (user) {
      return res.send(user);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
  }

  public async getAllUsers(req: Express.Request, res: Express.Response) {
    const { page, limit } = <getAllUsersDto>matchedData(req, { locations: ['query'] });
    try {
      const users = await userService.getAllUsers(page, limit);
      return res.send(users);
    } catch (err) {
      console.log(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }

  public async getUser(req: Express.Request, res: Express.Response) {
    const { id } = <getUserDto>matchedData(req);
    try {
      const user = await userService.getUserById(id);
      if (user) {
        return res.status(StatusCodes.OK).send(user);
      } else {
        return res.status(StatusCodes.NOT_FOUND).send('User not found');
      }
    } catch (err) {
      console.log(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }

  public async removeUser(req: Express.Request, res: Express.Response) {
    const { id } = <removeUserDto>matchedData(req);
    try {
      const user = await userService.removeUser(id);
      if (user) {
        return res.status(StatusCodes.OK).send(user);
      } else {
        return res.status(StatusCodes.NOT_FOUND).send('User not found');
      }
    } catch (err) {
      console.log(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }

  public async refreshToken(req: Express.Request, res: Express.Response) {
    const { authorization } = <refreshTokenDto>matchedData(req);
    try {
      const newTokens = await userService.refreshToken(authorization);
      return res.send(newTokens);
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        if (err.message == 'Invalid token') {
          return res.status(StatusCodes.UNAUTHORIZED).send('Invalid token');
        } else if (err.message == '500') {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      }
    }
  }
}

export default UserController;
