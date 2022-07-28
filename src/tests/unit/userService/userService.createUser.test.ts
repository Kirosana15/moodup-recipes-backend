import UserService from '../../../services/userService';
import { User } from '../../../models/userModel';
import { IUser } from '../../../interfaces/user';
import { mockUsername, mockPassword } from '../../mocks/mockUser';
import {
  clearAllCollections,
  closeConnection,
  connectToDb,
} from '../../consts';

const userService = new UserService();

describe('Testing createUser', () => {
  beforeAll(() => {
    connectToDb('createUser-test');
  });
  afterEach(() => {
    clearAllCollections();
  });
  afterAll(() => {
    closeConnection();
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
      expect(
        userService.createUser(mockUsername, mockPassword)
      ).rejects.toThrow();
    });
    test('no username provided', () => {
      expect(userService.createUser('', mockPassword)).rejects.toThrow();
    });
    test('no password provided', () => {
      expect(userService.createUser(mockUsername, '')).rejects.toThrow();
    });
  });
});
