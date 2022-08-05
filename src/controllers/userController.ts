//Controller for user authentication

import { userService } from '../services/userService';
import bcrypt from 'bcrypt';
import Express from 'express';
import { matchedData } from 'express-validator';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { GetAllUsersDto, GetUserDto, RegisterDto, RemoveUserDto } from '../interfaces/dto/userDtos';
import { User } from '../models/userModel';

interface MongoError {
  index: string;
  code: number;
  keyPattern: unknown;
  keyValue: unknown;
}

export class UserController {
  public async register(req: Express.Request, res: Express.Response) {
    const { username, password } = <RegisterDto>matchedData(req);
    if (password && username) {
      const hashed = await bcrypt.hash(password, 10);
      try {
        const user = await userService.createUser(username, hashed);
        return res.status(201).send(user);
      } catch (err: MongoError | unknown) {
        if ((<MongoError>err).code === 11000) {
          return res.status(StatusCodes.BAD_REQUEST).send('User already exists');
        } else {
          throw err;
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
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
    const newTokens = await userService.generateTokens(<User>req.user);
    return res.send(newTokens);
  }

  public getProfile(req: Express.Request, res: Express.Response) {
    const user = req.user;
    if (user) {
      return res.send(user);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
  }

  public async getAllUsers(req: Express.Request, res: Express.Response) {
    const { page, limit } = <GetAllUsersDto>matchedData(req, { locations: ['query'] });
    const users = await userService.getAllUsers(page, limit);
    return res.send(users);
  }

  public async getUser(req: Express.Request, res: Express.Response) {
    const { id } = <GetUserDto>matchedData(req);
    const user = await userService.getUserById(id);
    if (user) {
      return res.status(StatusCodes.OK).send(user);
    } else {
      return res.status(StatusCodes.NOT_FOUND).send('User not found');
    }
  }

  public async removeUser(req: Express.Request, res: Express.Response) {
    const { id } = <RemoveUserDto>matchedData(req);
    const user = await userService.removeUser(id);
    if (user) {
      return res.status(StatusCodes.OK).send(user);
    } else {
      return res.status(StatusCodes.NOT_FOUND).send('User not found');
    }
  }

  public async refreshToken(req: Express.Request, res: Express.Response) {
    const user = <User>req.user;
    try {
      const newTokens = await userService.generateTokens(user);
      res.send(newTokens);
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        if (err.message == 'Invalid token') {
          return res.status(StatusCodes.UNAUTHORIZED).send('Invalid token');
        } else {
          throw err;
        }
      }
    }
  }
}

export default new UserController();
