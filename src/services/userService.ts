//Service for database operations on the "users" collection
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { User } from '../models/userModel';
import jwt, { Secret } from 'jsonwebtoken';
import { UserSelect } from '../interfaces/select';

//UserService class for database operations on the "users" collection
class UserService {
  private TOKEN_KEY: Secret;
  constructor() {
    this.TOKEN_KEY = process.env.TOKEN_KEY || 'secret';
  }
  public createUser(username: string, password: string) {
    const user = new User({ username, password });
    return user.save();
  }

  public getUser(username: string, select = UserSelect.default) {
    return User.findOne({ username }, select).exec();
  }

  public async getUserById(id: string, select = UserSelect.default) {
    return User.findById(id, select).exec();
  }

  public updateRefreshToken(id: string, token: string, select = UserSelect.token) {
    return User.findByIdAndUpdate(id, { refreshToken: token }, { select: select }).exec();
  }

  public removeUser(id: string, select = UserSelect.default) {
    return User.findByIdAndRemove(id, { select: select }).exec();
  }

  public getAllUsers(page = 1, limit = 10, select = UserSelect.default): Promise<User[]> {
    return User.find({}, select)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  public comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      this.TOKEN_KEY,
      { expiresIn: '15m' },
    );
    const refreshToken = jwt.sign({ id: user._id }, this.TOKEN_KEY, {
      expiresIn: '30m',
    });

    await this.updateRefreshToken(user._id, refreshToken);
    return { accessToken, refreshToken };
  }
}
export const userService = new UserService();
