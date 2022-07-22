import 'dotenv/config';
import jwt from 'jsonwebtoken';
import Express from 'express';
import { TypedRequest } from '../interfaces/typedRequest';
import { IUser } from '../interfaces/user';

const TOKEN_KEY = process.env.TOKEN_KEY || 'secret';

// AuthController is a middleware class that handles user authentication

class AuthController {
  // authorizeUser verifies the user's token and fills the req.user object with the user's data
  public async authorizeUser(
    req: TypedRequest,
    res: Express.Response,
    next: Express.NextFunction
  ) {
    const token = req.headers.authorization;
    if (token) {
      try {
        const decoded = <IUser>jwt.verify(token, TOKEN_KEY);
        req.body.user = decoded;
        next();
      } catch (err) {
        res.status(401).send('Invalid token. Please refresh your token');
      }
    } else {
      res.status(401).send('Unauthorized');
    }
  }
  // authorizeAdmin checks if the user is an admin
  public async authorizeAdmin(
    req: TypedRequest,
    res: Express.Response,
    next: Express.NextFunction
  ) {
    if (req.body.user.isAdmin) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  }
}

export default AuthController;
