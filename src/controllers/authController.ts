import 'dotenv/config';
import jwt from 'jsonwebtoken';
import Express from 'express';
import { IUser } from '../interfaces/user';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { matchedData } from 'express-validator';

const TOKEN_KEY = process.env.TOKEN_KEY || 'secret';

// AuthController is a middleware class that handles user authentication

class AuthController {
  // authorizeUser verifies the user's token and fills the req.user object with the user's data
  public async authorizeUser(
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) {
    const { authorization } = matchedData(req);
    if (authorization) {
      try {
        const decoded = <IUser>jwt.verify(authorization, TOKEN_KEY);
        req.body.user = decoded;
        next();
      } catch (err) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .send('Invalid token. Please refresh your token');
      }
    } else {
      res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
  }
  // authorizeAdmin checks if the user is an admin
  public async authorizeAdmin(
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) {
    const { user } = matchedData(req);
    if (user.isAdmin) {
      next();
    } else {
      res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
    }
  }
}

export default AuthController;
