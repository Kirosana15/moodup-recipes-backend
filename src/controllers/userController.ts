//Controller for user authentication

import UserService from '../services/userService';
import bcrypt from 'bcrypt';
import Express from 'express';
import { TypedRequest } from '../interfaces/typedRequest';

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
    if (req.body.password && req.body.username) {
      const hashed = await bcrypt.hash(req.body.password, 10);
      try {
        const user = await userService.createUser(req.body.username, hashed);
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
      const user = await userService.getUser(req.body.username);

      if (!user) {
        return res.sendStatus(404);
      }

      const isValid = await userService.comparePassword(
        req.body.password,
        user.password
      );

      if (isValid) {
        const { accessToken, refreshToken } = await userService.generateToken(
          req,
          res,
          user
        );
        return res.status(200).send({ accessToken, refreshToken });
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
    try {
      const users = await userService.getAllUsers(
        parseInt(req.query.page),
        parseInt(req.query.limit)
      );
      res.status(200).send(users);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }

  //Provides data of a user with provided id
  public async getUser(req: TypedRequest, res: Express.Response) {
    try {
      const user = await userService.getUserById(req.params.id);
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
    try {
      const user = await userService.removeUser(req.params.id);
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
    const { accessToken, refreshToken } = await userService.refreshToken(
      req,
      res
    );
    if (accessToken && refreshToken) {
      res.send({ accessToken, refreshToken });
    }
  }
}

export default UserController;
