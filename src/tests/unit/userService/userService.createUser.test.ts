import UserService from '../../../services/userService';
import { User } from '../../../models/userModel';
import mongoose from 'mongoose';
import { IUser } from '../../../interfaces/user';
import { mockUsername, mockPassword } from '../../mocks/mockUser';
import { CONN_ERR, DB_URI, DC_ERR } from '../../consts';

const userService = new UserService();

describe('Testing createUser', () => {
  beforeAll(async () => {
    try {
      const dbName = 'getUser-test';
      await mongoose.connect(DB_URI, {
        dbName,
        autoCreate: true,
      });
    } catch (error) {
      console.log(CONN_ERR);
    }
  });
  afterEach(async () => {
    await User.deleteMany();
  });
  afterAll(async () => {
    try {
      await mongoose.connection.close();
    } catch (err) {
      console.log(DC_ERR);
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
