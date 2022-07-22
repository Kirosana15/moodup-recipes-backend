//Controller for user authentication

import UserService from '../services/userService';
import bcrypt from 'bcrypt';
import Express from 'express';
import { TypedRequest } from '../interfaces/typedRequest';
import { matchedData } from 'express-validator';
import { IUser } from '../interfaces/user';

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
  public async register(req: TypedRequest, res: Express.Response) {
    const { username, password } = matchedData(req);
    if (password && username) {
      const hashed = await bcrypt.hash(password, 10);
      try {
        const user = await userService.createUser(username, hashed);
        res.status(201).send(user);
      } catch (err: MongoError | unknown) {
        if ((<MongoError>err).code === 11000) {
          res.status(400).send('User already exists');
        } else {
          console.log(err);
          res.status(400);
        }
      }
    } else {
      res.status(400).send('Missing username or password');
    }
  }
  //Authenticate a user with provided username and password
  public async login(
    req: TypedRequest,
    res: Express.Response
  ): Promise<Express.Response<{ accessToken: string; refreshToken: string }>> {
    try {
      const { username, password } = matchedData(req);
      const user = <IUser>await userService.getUser(username);

      if (!user) {
        return res.sendStatus(404);
      }

      const isValid = await userService.comparePassword(
        password,
        user.password
      );

      if (isValid) {
        const newTokens = await userService.generateToken(user);
        return res.status(200).send(newTokens);
      } else {
        return res.status(401).send('Invalid credentials');
      }
    } catch (err) {
      console.log(err);
      return res.status(500);
    }
  }

  //Provides logged in user data to the client
  public getProfile(req: TypedRequest, res: Express.Response) {
    if (req.body.user) {
      res.status(200).send(req.body.user);
    } else {
      res.status(401).send('Unauthorized');
    }
  }

  //Provides a list of all users
  public async getAllUsers(req: TypedRequest, res: Express.Response) {
    const { page, limit } = matchedData(req, { locations: ['query'] });
    try {
      const users = await userService.getAllUsers(page, limit);
      res.status(200).send(users);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }

  //Provides data of a user with provided id
  public async getUser(req: TypedRequest, res: Express.Response) {
    const { id } = matchedData(req);
    try {
      const user = await userService.getUserById(id);
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }

  //Deletes a user with provided id
  public async removeUser(req: TypedRequest, res: Express.Response) {
    const { id } = matchedData(req);
    try {
      const user = await userService.removeUser(id);
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }

  public async refreshToken(req: TypedRequest, res: Express.Response) {
    const { authorization } = matchedData(req);
    try {
      const newTokens = await userService.refreshToken(authorization);
      res.send(newTokens);
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        if (err.message == 'Invalid token') {
          res.status(401).send('Invalid token');
        } else if (err.message == '500') {
          res.status(500);
        }
      }
    }
  }
}

export default UserController;
