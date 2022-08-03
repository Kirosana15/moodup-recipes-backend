import { userService } from '../services/userService';
import { User } from '../models/userModel';
import mongoose from 'mongoose';

describe('Testing userService', () => {
  beforeAll(async () => {
    try {
      const dbUri = 'mongodb://localhost:27017';
      const dbName = 'test';
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
      await User.collection.drop();
      await mongoose.disconnect();
    } catch (err) {
      console.log('DB disconnect error');
    }
  });

  test('createUser returns new user', async () => {
    const username = 'user';
    const password = 'password';
    const newUser = await userService.createUser(username, password);
    expect(newUser).toBeDefined();
    expect(newUser.username).toBe(username);
    expect(newUser.password).toBe(password);
  });
});
