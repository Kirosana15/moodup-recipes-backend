import UserService from '../../services/userService';
import { User } from '../../models/userModel';
import mongoose from 'mongoose';

const userService = new UserService();

describe('Testing userService', () => {
  beforeAll(async () => {
    try {
      const dbUri = 'mongodb://localhost:27017';
      const dbName = 'createUser-test';
      await mongoose.connect(dbUri, {
        dbName,
        autoCreate: true,
      });
    } catch (error) {
      console.log('DB connect error');
    }
  });
  afterAll(async () => {
    try {
      await mongoose.connection.db.dropDatabase();
      await mongoose.disconnect();
    } catch (err) {
      console.log('DB disconnect error');
    }
  });

  test('createUser returns new user', async () => {
    const username = 'jestuser';
    const password = 'jesttest';
    await userService.createUser(username, password);
    const user = await User.findOne({ username });
    expect(user).toBeDefined();
    expect(user.username).toBe(username);
    expect(user.password).toBe(password);
  });
});
