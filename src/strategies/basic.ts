import { IUser } from '../interfaces/user';
import { userService } from '../services/userService';

export const basicLogic = async (username: string, password: string, done: (error: any, user?: any) => void) => {
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
};
