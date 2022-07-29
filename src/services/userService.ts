//Service for database operations on the "users" collection
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { User } from '../models/userModel';
import jwt, { Secret } from 'jsonwebtoken';
import { IUser } from '../interfaces/user';

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

  public getUser(username: string) {
    return User.findOne({ username }).exec();
  }

  public getUserById(id: string) {
    return User.findById(id).exec();
  }

  public updateRefreshToken(id: string, token: string) {
    return User.findByIdAndUpdate(id, { refreshToken: token }).exec();
  }

  public removeUser(id: string) {
    return User.findByIdAndRemove(id).exec();
  }

  public getAllUsers(page = 1, limit = 10) {
    return User.find({}, '_id username isAdmin created')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created: -1 })
      .exec();
  }

  public comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public async generateToken(
    user: IUser
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      this.TOKEN_KEY,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign({ id: user.id }, this.TOKEN_KEY, {
      expiresIn: '30m',
    });
    try {
      await this.updateRefreshToken(user.id, refreshToken);
      return { accessToken, refreshToken };
    } catch (err) {
      console.log(err);
      throw new Error('500');
    }
  }
}
export const userService = new UserService();
