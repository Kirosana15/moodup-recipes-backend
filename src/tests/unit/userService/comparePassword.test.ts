import UserService from '../../../services/userService';
import { mockPassword } from '../../mocks/mockUser';
import { setupTests } from '../../setupTests';
import bcrypt from 'bcrypt';

const userService = new UserService();

setupTests('comparePassword', () => {
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
