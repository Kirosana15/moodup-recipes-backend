import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces/user';
import { Strategy as BearerStrategy } from 'passport-http-bearer';

const TOKEN_KEY = process.env.TOKEN_KEY || 'secret';

export const bearerStrategy = new BearerStrategy((token, done) => {
  try {
    const decoded = <IUser>jwt.verify(token, TOKEN_KEY);
    return done(null, decoded);
  } catch (err) {
    return done(err);
  }
});
