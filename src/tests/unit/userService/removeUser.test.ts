import { mockId, saveUser, saveUsers } from '../../mocks/mockUser';
import { userService } from '../../../services/userService';
import { User } from '../../../models/userModel';
import { setupTests } from '../../setupTests';

setupTests('removeUser', () => {
  test('returns removed user', async () => {
    const newUser = await saveUser();
    const user = await userService.removeUser(newUser.id);
    expect(user).toBeDefined();
    expect(user?.username).toBe(newUser.username);
    expect(user?.password).toBe(newUser.password);
  });
  test('removes user from database', async () => {
    const newUser = await saveUser();
    await userService.removeUser(newUser.id);
    expect(await User.findById(newUser.id).exec()).toBeNull();
  });
  test("doesn't return user if id doesn't exist", async () => {
    const user = await userService.removeUser(mockId);
    expect(user).toBeNull();
  });
  test("throws and doesn't remove any users if id is not provided", async () => {
    saveUsers(2);
    await expect(userService.removeUser('')).rejects.toThrow();
    expect(await User.countDocuments({})).toBe(2);
  });
});
