//Controller for user authentication
import 'dotenv/config';
import UserService from '../services/userService';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const TOKEN_KEY = process.env.TOKEN_KEY || 'secret';
const userService = new UserService();

//UserController class for user related requests
class UserController {
  //Register a new user with provided username and password
  //password is hashed before storing in the database
  public async register(req: any, res: any) {
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
          res.status(400).send('User already exists');
        } else {
          res.status(400).send(err);
        }
      }
    } else {
      res.status(400).send('Missing username or password');
    }
  }
  //Authenticate a user with provided username and password
  public async login(req: any, res: any, next: any) {
    if (req.body.password && req.body.username) {
      try {
        const user: any = await userService.getUser(req.body.username);
        if (user) {
          try {
            const isValid = await user.comparePassword(req.body.password);
            if (isValid) {
              req.user = user;
              next();
            } else {
              res.status(401).send('Invalid password');
            }
          } catch (err) {
            console.log(err);
            res.status(400);
          }
        } else {
          res.status(404).send('User not found');
        }
      } catch (err) {
        res.status(400).send(err);
      }
    } else {
      res.status(400).send('Missing username or password');
    }
  }

  //Provides logged in user data to the client
  public getProfile(req: any, res: any) {
    if (req.user) {
      res.status(200).send(req.user);
    } else {
      res.status(401).send('Unauthorized');
    }
  }

  //Provides a list of all users
  public async getAllUsers(req: any, res: any) {
    try {
      const users = await userService.getAllUsers(
        req.query.page,
        req.query.limit
      );
      res.status(200).send(users);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  //Provides data of a user with provided id
  public async getUser(req: any, res: any) {
    try {
      const user = await userService.getUser(req.params.id);
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }

  //Deletes a user with provided id
  public async removeUser(req: any, res: any) {
    try {
      const user = await userService.removeUser(req.params.id);
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      res.status(400).send(err);
    }
  }

  //Validates a refresh token and fetches user data if valid
  public async refreshToken(req: any, res: any, next: any) {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, TOKEN_KEY, async (err: any, decoded: any) => {
        if (err) {
          res.status(401).send(err);
        } else {
          try {
            const user: any = await userService.getUserById(decoded.id);
            if (user) {
              if (user.compareToken(token)) {
                req.user = user;
                next();
              } else {
                res.status(401).send('Invalid token');
              }
            } else {
              res.status(404).send('User not found');
            }
          } catch (err) {
            res.status(400).send(err);
          }
        }
      });
    } else {
      res.status(401).send('Unauthorized');
    }
  }

  //Generates a new set of tokens for the user
  //New refresh token is stored and old one is invalidated
  public async generateToken(req: any, res: any) {
    const accessToken = jwt.sign(
      {
        id: req.user._id,
        username: req.user.username,
        isAdmin: req.user.isAdmin,
      },
      TOKEN_KEY,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign({ id: req.user._id }, TOKEN_KEY, {
      expiresIn: '30m',
    });
    try {
      await userService.updateRefreshToken(req.user._id, refreshToken);
      res.status(200).send({ accessToken, refreshToken });
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

export default UserController;
