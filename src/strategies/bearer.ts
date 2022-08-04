import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { UserObject } from '../interfaces/user';

const TOKEN_KEY = process.env.TOKEN_KEY || 'secret';

export const bearerLogic = (token: string, done: (err: any, user?: any) => void) => {
  try {
    const decoded = <UserObject>jwt.verify(token, TOKEN_KEY);
    return done(null, decoded);
  } catch (err) {
    return done(err);
  }
};
