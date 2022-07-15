//Service for database operations on the "users" collection

import { User } from "../models/userModel";

//UserService class for database operations on the "users" collection
class UserService {
  public async createUser(username: string, password: string) {
    const user = new User({ username, password });
    return user.save();
  }

  public async getUser(username: string) {
    return await User.findOne({ username });
  }

  public async getUserById(id: string) {
    return await User.findById(id);
  }

  public async updateRefreshToken(id: string, token: string) {
    return await User.findByIdAndUpdate(id, { refreshToken: token });
  }

  public async removeUser(id: string) {
    return await User.findByIdAndRemove(id);
  }

  public async getAllUsers(page = 1, limit = 10) {
    return await User.find({}, "_id username isAdmin created")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created: -1 })
      .exec();
  }
}

export default UserService;
