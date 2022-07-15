//Controller for user authentication
import "dotenv/config";
import UserService from "../services/userService";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Express from "express";
import { Query } from "express-serve-static-core";

const TOKEN_KEY = process.env.TOKEN_KEY || "secret";
const userService = new UserService();

export interface TypedRequest<T extends Query, U> extends Express.Request {
  query: T;
  body: U;
}

//UserController class for user related requests
export class UserController {
  //Register a new user with provided username and password
  //password is hashed before storing in the database
  public async register(req: Express.Request, res: Express.Response) {
    if (req.body.password && req.body.username) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      try {
        const user = await userService.createUser(
          req.body.username,
          req.body.password
        );
        res.status(201).send(user);
      } catch (err: any) {
        if (err.code === 11000) {
          res.status(400).send("User already exists");
        } else {
          res.status(400).send(err);
        }
      }
    } else {
      res.status(400).send("Missing username or password");
    }
  }
  //Authenticate a user with provided username and password
  public async login(
    req: TypedRequest<
      Query,
      { password: string; username: string; user: unknown }
    >,
    res: Express.Response,
    next: Express.NextFunction
  ) {
    if (req.body.password && req.body.username) {
      try {
        const user = await userService.getUser(req.body.username);
        if (user) {
          try {
            const isValid = await user.comparePassword(req.body.password);
            if (isValid) {
              req.body.user = user;
              next();
            } else {
              res.status(401).send("Invalid password");
            }
          } catch (err) {
            console.log(err);
            res.status(400);
          }
        } else {
          res.status(404).send("User not found");
        }
      } catch (err) {
        res.status(400).send(err);
      }
    } else {
      res.status(400).send("Missing username or password");
    }
  }

  //Provides logged in user data to the client
  public getProfile(req: Express.Request, res: Express.Response) {
    if (req.body.user) {
      res.status(200).send(req.body.user);
    } else {
      res.status(401).send("Unauthorized");
    }
  }

  //Provides a list of all users
  public async getAllUsers(
    req: TypedRequest<{ page: string; limit: string }, unknown>,
    res: Express.Response
  ) {
    try {
      const users = await userService.getAllUsers(
        parseInt(req.query.page),
        parseInt(req.query.limit)
      );
      res.status(200).send(users);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  //Provides data of a user with provided id
  public async getUser(req: Express.Request, res: Express.Response) {
    try {
      const user = await userService.getUser(req.params.id);
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send("User not found");
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }

  //Deletes a user with provided id
  public async removeUser(req: Express.Request, res: Express.Response) {
    try {
      const user = await userService.removeUser(req.params.id);
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send("User not found");
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }

  //Validates a refresh token and fetches user data if valid
  public async refreshToken(
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, TOKEN_KEY, async (err, decoded: any) => {
        if (err) {
          res.status(401).send(err);
        } else {
          try {
            const user = await userService.getUserById(decoded.id);
            if (user) {
              if (user.compareToken(token)) {
                req.body.user = user;
                next();
              } else {
                res.status(401).send("Invalid token");
              }
            } else {
              res.status(404).send("User not found");
            }
          } catch (err) {
            res.status(400).send(err);
          }
        }
      });
    } else {
      res.status(401).send("Unauthorized");
    }
  }

  //Generates a new set of tokens for the user
  //New refresh token is stored and old one is invalidated
  public async generateToken(req: Express.Request, res: Express.Response) {
    const accessToken = jwt.sign(
      {
        id: req.body.user._id,
        username: req.body.user.username,
        isAdmin: req.body.user.isAdmin,
      },
      TOKEN_KEY,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign({ id: req.body.user._id }, TOKEN_KEY, {
      expiresIn: "30m",
    });
    try {
      await userService.updateRefreshToken(req.body.user._id, refreshToken);
      res.status(200).send({ accessToken, refreshToken });
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

export default UserController;
