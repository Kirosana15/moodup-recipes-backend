import { Select } from '../interfaces/select';
import { User } from '../models/userModel';
import { userService } from '../services/userService';

export const basicLogic = async (username: string, password: string, done: (error: any, user?: any) => void) => {
  try {
    const userFromDb = await userService.getUser(username, Select.password);
    const { password: hashedPassword, ...user } = <User>userFromDb?.toObject();

    if (!user) {
      return done(null, false);
    }
    if (!(await userService.comparePassword(password, hashedPassword))) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};
