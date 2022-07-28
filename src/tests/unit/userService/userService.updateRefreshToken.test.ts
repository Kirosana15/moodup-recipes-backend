import {
  mockId,
  mockPassword,
  mockUsername,
  mockToken,
} from '../../mocks/mockUser';
import UserService from '../../../services/userService';
import {
  clearAllCollections,
  closeConnection,
  connectToDb,
} from '../../consts';
import { User } from '../../../models/userModel';

const userService = new UserService();

describe('Testing updateRefreshToken', () => {
  beforeAll(async () => {
    connectToDb('updateRefreshToken-test');
  });
  afterEach(async () => {
    clearAllCollections();
  });
  afterAll(() => {
    closeConnection();
  });

  test('returns the user with an old token', async () => {
    const newUser = await new User({
      username: mockUsername,
      password: mockPassword,
    }).save();
    const user = await userService.updateRefreshToken(newUser.id, mockToken);
    expect(user).toBeDefined();
    expect(user?.refreshToken).toBe(newUser.refreshToken);
    expect(user?.refreshToken).not.toBe(mockToken);
  });

  test('changes user token in database', async () => {
    const newUser = await new User({
      username: mockUsername,
      password: mockPassword,
    }).save();
    await userService.updateRefreshToken(newUser.id, mockToken);
    const user = await User.findOne({ username: mockUsername });
    expect(user?.refreshToken).toBe(mockToken);
  });

  test("doesn't return the user if id doesn't exist", async () => {
    const user = await userService.updateRefreshToken(mockId, mockToken);
    expect(user).toBeNull();
  });
});
