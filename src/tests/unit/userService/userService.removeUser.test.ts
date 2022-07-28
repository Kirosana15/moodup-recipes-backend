import { mockId, mockUser } from '../../mocks/mockUser';
import UserService from '../../../services/userService';
import {
  clearAllCollections,
  closeConnection,
  connectToDb,
} from '../../consts';
import { User } from '../../../models/userModel';

const userService = new UserService();

describe('Testing removeUser', () => {
  beforeAll(async () => {
    connectToDb('removeUser-test');
  });
  afterEach(async () => {
    clearAllCollections();
  });
  afterAll(() => {
    closeConnection();
  });

  test('returns removed user', async () => {
    const newUser = new mockUser();
    const { id } = await new User(newUser).save();
    const user = await userService.removeUser(id);
    expect(user).toBeDefined();
    expect(user?.username).toBe(newUser.username);
    expect(user?.password).toBe(newUser.password);
  });
  test('removes user from database', async () => {
    const newUser = new mockUser();
    const { id } = await new User(newUser).save();
    await userService.removeUser(id);
    expect(await User.findById(id).exec()).toBeNull();
  });
  test("doesn't return user if id doesn't exist", async () => {
    const user = await userService.removeUser(mockId);
    expect(user).toBeNull();
  });
  test("throws and doesn't remove any users if id is not provided", async () => {
    await new User(new mockUser()).save();
    await new User(new mockUser()).save();
    await expect(userService.removeUser('')).rejects.toThrow();
    expect(await User.countDocuments({})).toBe(2);
  });
});
