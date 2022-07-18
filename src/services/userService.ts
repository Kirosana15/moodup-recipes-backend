//Service for database operations on the "users" collection

import mongoose from 'mongoose';
const User = mongoose.model('User');

//UserService class for database operations on the "users" collection
class UserService {
  public async createUser(username: string, password: string) {
    const user = new User({ username, password });
    return user.save();
  }

  public async getUser(username: string) {
    return User.findOne({ username });
  }

  public async getUserById(id: string) {
    return User.findById(id);
  }

  public async updateRefreshToken(id: string, token: string) {
    return User.findByIdAndUpdate(id, { refreshToken: token });
  }

  public async removeUser(id: string) {
    return User.findByIdAndRemove(id);
  }

  public async getAllUsers(page: number = 1, limit: number = 10) {
    return User.find({}, '_id username isAdmin created')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created: -1 })
      .exec();
  }
}

export default UserService;
