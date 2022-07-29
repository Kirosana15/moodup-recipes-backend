import { BasicStrategy } from 'passport-http';
import { IUser } from '../interfaces/user';
import UserService from '../services/userService';

const userService = new UserService();

export const basicStrategy = new BasicStrategy(
  async (username: string, password: string, done) => {
    try {
      const user = <IUser>await userService.getUser(username);
      if (!user) {
        return done(null, false);
      }
      if (!(await userService.comparePassword(password, user.password))) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);
