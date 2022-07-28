import UserService from '../../../services/userService';
import { User } from '../../../models/userModel';
import mongoose from 'mongoose';
import { IUser } from '../../../interfaces/user';
import { mockUsername, mockPassword } from '../../mocks/mockUser';

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
  afterEach(async () => {
    await User.deleteMany();
  });
  afterAll(async () => {
    try {
      await mongoose.connection.close();
    } catch (err) {
      console.log('DB disconnect error');
    }
  });

  test('save new User in a database', async () => {
    await userService.createUser(mockUsername, mockPassword);
    const user = <IUser>await User.findOne({ mockUsername });
    expect(user).toBeDefined();
    expect(user.username).toBe(mockUsername);
    expect(user.password).toBe(mockPassword);
  });
  describe('error thrown when', () => {
    test('username already exists', async () => {
      await userService.createUser(mockUsername, mockPassword);
      await expect(
        userService.createUser(mockUsername, mockPassword)
      ).rejects.toThrow();
    });
    test('no username provided', async () => {
      await expect(userService.createUser('', mockPassword)).rejects.toThrow();
    });
    test('no password provided', async () => {
      await expect(userService.createUser(mockUsername, '')).rejects.toThrow();
    });
  });
});
