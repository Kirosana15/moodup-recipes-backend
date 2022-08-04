import 'dotenv/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserObject } from '../interfaces/user';
import { userService } from '../services/userService';

const TOKEN_KEY = process.env.TOKEN_KEY || 'secret';

export const refreshBearerLogic = async (token: string, done: (error: any, user?: any) => void) => {
  try {
    const decoded = <JwtPayload>jwt.verify(token, TOKEN_KEY);
    try {
      const user = <UserObject>await userService.getUserById(decoded.id);
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
};
