import 'dotenv/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Select } from '../interfaces/select';
import { User } from '../models/userModel';
import { userService } from '../services/userService';

const TOKEN_KEY = process.env.TOKEN_KEY || 'secret';

export const refreshBearerLogic = async (token: string, done: (error: any, user?: any) => void) => {
  try {
    const decoded = <JwtPayload>jwt.verify(token, TOKEN_KEY);
    try {
      const { refreshToken, ...user } = <User>await userService.getUserById(decoded.id, Select.token);
      if (!user || token !== refreshToken) {
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
