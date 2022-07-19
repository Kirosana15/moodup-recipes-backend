//Service for database operations on the "users" collection

import { User } from '../models/userModel';

//UserService class for database operations on the "users" collection
class UserService {
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
}

export default UserService;
