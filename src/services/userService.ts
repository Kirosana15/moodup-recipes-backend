//Service for database operations on the "users" collection
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { User } from '../models/userModel';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { Select } from '../interfaces/select';

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

  public getUser(username: string, select = Select.default) {
    return User.findOne({ username }, select).exec();
  }

  public async getUserById(id: string, select = Select.default): Promise<User> {
    console.log(await (<Promise<User>>User.findById(id, 'refreshToken').exec()));
    return <Promise<User>>User.findById(id, select).exec();
  }

  public updateRefreshToken(id: string, token: string, select = Select.default) {
    return User.findByIdAndUpdate(id, { refreshToken: token }, { select: select }).exec();
  }

  public removeUser(id: string, select = Select.default) {
    return User.findByIdAndRemove(id, { select: select }).exec();
  }

  public getAllUsers(page = 1, limit = 10, select = Select.default): Promise<User[]> {
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
    console.log(user);
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
    try {
      await this.updateRefreshToken(user._id, refreshToken);
      return { accessToken, refreshToken };
    } catch (err) {
      console.log(err);
      throw new Error('500');
    }
  }

  public async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded = <JwtPayload>jwt.verify(token, this.TOKEN_KEY);
    try {
      const user = await this.getUserById(decoded.id, Select.token);
      if (!user || token !== user.refreshToken) {
        throw new Error('Invalid token');
      }
      return this.generateTokens(user);
    } catch (err) {
      console.log(err);
      throw new Error('500');
    }
  }
}
export const userService = new UserService();
