//Controller for user authentication

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

//UserController class for user related requests
export class UserController {
  //Register a new user with provided username and password
  //password is hashed before storing in the database
  public async register(req: Express.Request, res: Express.Response) {
    const { username, password } = <registerDto>matchedData(req);
    if (password && username) {
      const hashed = await bcrypt.hash(password, 10);
      try {
        const user = await userService.createUser(username, hashed);
        res.status(201).send(user);
      } catch (err: MongoError | unknown) {
        if ((<MongoError>err).code === 11000) {
          res.status(StatusCodes.BAD_REQUEST).send('User already exists');
        } else {
          console.log(err);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
        }
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send('Missing username or password');
    }
  }
  //Authenticate a user with provided username and password
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

  //Provides logged in user data to the client
  public getProfile(req: Express.Request, res: Express.Response) {
    const { user } = <getProfileDto>matchedData(req);
    if (user) {
      res.send(user);
    } else {
      res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
  }

  //Provides a list of all users
  public async getAllUsers(req: Express.Request, res: Express.Response) {
    const { page, limit } = <getAllUsersDto>matchedData(req, { locations: ['query'] });
    try {
      const users = await userService.getAllUsers(page, limit);
      res.send(users);
    } catch (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }

  //Provides data of a user with provided id
  public async getUser(req: Express.Request, res: Express.Response) {
    const { id } = <getUserDto>matchedData(req);
    try {
      const user = await userService.getUserById(id);
      if (user) {
        res.status(StatusCodes.OK).send(user);
      } else {
        res.status(StatusCodes.NOT_FOUND).send('User not found');
      }
    } catch (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }

  //Deletes a user with provided id
  public async removeUser(req: Express.Request, res: Express.Response) {
    const { id } = <removeUserDto>matchedData(req);
    try {
      const user = await userService.removeUser(id);
      if (user) {
        res.status(StatusCodes.OK).send(user);
      } else {
        res.status(StatusCodes.NOT_FOUND).send('User not found');
      }
    } catch (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }

  public async refreshToken(req: Express.Request, res: Express.Response) {
    const { authorization } = <refreshTokenDto>matchedData(req);
    try {
      const newTokens = await userService.refreshToken(authorization);
      res.send(newTokens);
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        if (err.message == 'Invalid token') {
          res.status(StatusCodes.UNAUTHORIZED).send('Invalid token');
        } else if (err.message == '500') {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(StatusCodes.INTERNAL_SERVER_ERROR);
        }
      }
    }
  }
}

export default UserController;
