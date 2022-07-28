import { mockId, mockUser } from '../../mocks/mockUser';
import UserService from '../../../services/userService';
import {
  clearAllCollections,
  closeConnection,
  connectToDb,
} from '../../consts';
import { User } from '../../../models/userModel';

const userService = new UserService();

describe('testing getAllUsers', () => {
  beforeAll(async () => {
    connectToDb('getAllUsers-test');
  });
  afterEach(async () => {
    clearAllCollections();
  });
  afterAll(() => {
    closeConnection();
  });

  test('returns existing users', async () => {
    await new User(new mockUser()).save();
    await new User(new mockUser()).save();
    await new User(new mockUser()).save();
    const users = await userService.getAllUsers();
    expect(users).toHaveLength(3);
  });
  test('returns empty array if no users present', async () => {
    const users = await userService.getAllUsers();
    expect(users).toHaveLength(0);
  });
  test('return paginated results', async () => {
    for (let i = 0; i < 20; i++) {
      await new User(new mockUser()).save();
    }
    let users = await userService.getAllUsers();
    expect(users).toHaveLength(10);
    users = await userService.getAllUsers(undefined, 20);
    expect(users).toHaveLength(20);
    const pagedUsers = await userService.getAllUsers(2, 5);
    console.log(pagedUsers);
    console.log(users);
    expect(pagedUsers[0]).toEqual(users[5]);
  });
});
