import UserService from '../../services/userService';
import { User } from '../../models/userModel';
import mongoose from 'mongoose';
import { IUser } from '../../interfaces/user';

const userService = new UserService();

describe('Testing createUser', () => {
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

  test('save new User in a database', async () => {
    const username = 'jestuser';
    const password = 'jesttest';
    await userService.createUser(username, password);
    const user = <IUser>await User.findOne({ username });
    expect(user).toBeDefined();
    expect(user.username).toBe(username);
    expect(user.password).toBe(password);
  });
  describe('error thrown when', () => {
    test('username already exists', async () => {
      const username = 'dupeuser';
      const password = 'jesttest';
      await userService.createUser(username, password);
      await expect(
        userService.createUser(username, password)
      ).rejects.toThrow();
    });
    test('no username provided', async () => {
      const username = '';
      const password = 'jesttest';
      await expect(
        userService.createUser(username, password)
      ).rejects.toThrow();
    });
    test('no password provided', async () => {
      const username = 'riskyuser';
      const password = '';
      await expect(
        userService.createUser(username, password)
      ).rejects.toThrow();
    });
  });
});
