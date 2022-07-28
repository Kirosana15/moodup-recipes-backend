import UserService from '../../../services/userService';
import { User } from '../../../models/userModel';
import mongoose from 'mongoose';
import { IUser } from '../../../interfaces/user';
import { mockUsername, mockPassword } from '../../mocks/mockUser';
import { CONN_ERR, DB_URI, DC_ERR } from '../../consts';

const userService = new UserService();

describe('Testing getUser', () => {
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

  test('fetch a User in a database', async () => {
    await new User({ username: mockUsername, password: mockPassword }).save();
    const user = <IUser>await userService.getUser(mockUsername);
    expect(user).toBeDefined();
    expect(user.username).toBe(mockUsername);
    expect(user.password).toBe(mockPassword);
  });
  describe('no user returned when', () => {
    test("username doesn't exists", async () => {
      expect(await userService.getUser(mockUsername)).toBeNull();
    });
    test('no username provided', async () => {
      const username = '';
      expect(await userService.getUser(username)).toBeNull();
    });
  });
});
