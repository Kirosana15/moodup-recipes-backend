import 'dotenv/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../interfaces/user';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { userService } from '../services/userService';

const TOKEN_KEY = process.env.TOKEN_KEY || 'secret';

export const bearerStrategy = new BearerStrategy((token, done) => {
  try {
    const decoded = <IUser>jwt.verify(token, TOKEN_KEY);
    return done(null, decoded);
  } catch (err) {
    return done(err);
  }
});

export const refreshBearerStrategy = new BearerStrategy(async (token, done) => {
  try {
    const decoded = <JwtPayload>jwt.verify(token, TOKEN_KEY);
    try {
      const user = <IUser>await userService.getUserById(decoded.id);
      if (!user || token !== user.refreshToken) {
        throw new Error('Invalid token');
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  } catch (err) {
    return done(err);
  }
});
