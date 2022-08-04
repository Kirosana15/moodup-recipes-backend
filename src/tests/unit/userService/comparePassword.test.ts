import UserService from '../../../services/userService';
import { generateUser, mockPassword } from '../../mocks/mockUser';
import { setupTests } from '../../setupTests';
import bcrypt from 'bcrypt';

const userService = new UserService();

setupTests('comparePassword', () => {
  test('returns true if the password matches hashed password', async () => {
    const hashedPassword = await bcrypt.hash(mockPassword, 1);
    expect(
      await userService.comparePassword(mockPassword, hashedPassword)
    ).toBe(true);
  });

  test("returns false if the password doesn't match hashed password", async () => {
    const hashedPassword = await bcrypt.hash(mockPassword, 1);
    expect(await userService.comparePassword('wrong', hashedPassword)).toBe(
      false
    );
  });
  test('should return true for password and a hash of a newly created user', async () => {
    const { username, password } = generateUser();
    const { password: hash } = await userService.createUser(username, password);
    const passwordsMatch = userService.comparePassword(password, hash);
    expect(passwordsMatch).toBeTruthy();
  });
});
