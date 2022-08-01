import { mockId, mockPassword, mockUsername } from '../../mocks/mockUser';
import UserService from '../../../services/userService';
import { User } from '../../../models/userModel';
import { setupTests } from '../../setupTests';

const userService = new UserService();

setupTests('getUserById', () => {
  test("doesn't return user when id doesn't exist", async () => {
    const user = await userService.getUserById(mockId);
    expect(user).toBeNull();
  });

  test("throws when id isn't provided", async () => {
    await expect(userService.getUserById('')).rejects.toThrow();
  });

  test('fetch User by id', async () => {
    const newUser = await new User({
      username: mockUsername,
      password: mockPassword,
    }).save();
    const user = await userService.getUserById(newUser.id);
    expect(user).toBeDefined();
    expect(user?.username).toBe(mockUsername);
    expect(user?.password).toBe(mockPassword);
  });
});
