import UserService from '../../../services/userService';
import { mockPassword } from '../../mocks/mockUser';
import {
  clearAllCollections,
  closeConnection,
  connectToDb,
} from '../../consts';
import bcrypt from 'bcrypt';

const userService = new UserService();

describe('Testing comparePassword', () => {
  beforeAll(() => {
    connectToDb('comparePassword-test');
  });
  afterEach(() => {
    clearAllCollections();
  });
  afterAll(() => {
    closeConnection();
  });

  test('returns true if the password matches hashed password', async () => {
    const hashedPassword = await bcrypt.hash(mockPassword, 10);
    expect(
      await userService.comparePassword(mockPassword, hashedPassword)
    ).toBe(true);
  });

  test("returns false if the password doesn't match hashed password", async () => {
    const hashedPassword = await bcrypt.hash(mockPassword, 10);
    expect(await userService.comparePassword('wrong', hashedPassword)).toBe(
      false
    );
  });
});
