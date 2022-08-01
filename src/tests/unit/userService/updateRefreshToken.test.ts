import { mockId, mockToken, saveUser } from '../../mocks/mockUser';
import UserService from '../../../services/userService';
import { User } from '../../../models/userModel';
import { setupTests } from '../../setupTests';

const userService = new UserService();

setupTests('updateRefreshToken', () => {
  test('returns the user with an old token', async () => {
    const newUser = await saveUser();
    const user = await userService.updateRefreshToken(newUser.id, mockToken);
    expect(user?.refreshToken).toBe(newUser.refreshToken);
  });

  test('changes user token in database', async () => {
    const newUser = await saveUser();
    await userService.updateRefreshToken(newUser.id, mockToken);
    const user = await User.findOne({ username: newUser.username });
    expect(user?.refreshToken).toBe(mockToken);
  });

  test("doesn't return the user if id doesn't exist", async () => {
    const user = await userService.updateRefreshToken(mockId, mockToken);
    expect(user).toBeNull();
  });
});
