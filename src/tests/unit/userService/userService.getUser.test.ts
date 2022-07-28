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

describe('Testing getUser', () => {
  beforeAll(() => {
    connectToDb('getUser-test');
  });
  afterEach(() => {
    clearAllCollections();
  });
  afterAll(() => {
    closeConnection();
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
