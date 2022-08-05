import { User } from '../../../models/userModel';
import { userService } from '../../../services/userService';
import { mockUsername, mockPassword } from '../../mocks/mockUser';
import { setupTests } from '../../setupTests';

setupTests('createUser', () => {
  test('save new User in a database', async () => {
    await userService.createUser(mockUsername, mockPassword);
    const user = await User.findOne({ mockUsername });
    expect(user).toBeDefined();
    expect(user?.username).toBe(mockUsername);
    expect(user?.password).toBe(mockPassword);
  });

  describe('error thrown when', () => {
    test('username already exists', async () => {
      await userService.createUser(mockUsername, mockPassword);
      await expect(userService.createUser(mockUsername, mockPassword)).rejects.toThrow('duplicate key error');
    });

    test('no username provided', async () => {
      await expect(userService.createUser('', mockPassword)).rejects.toThrow('`username` is required');
    });

    test('no password provided', async () => {
      await expect(userService.createUser(mockUsername, '')).rejects.toThrow('`password` is required');
    });
  });

  test('runs User.save()', async () => {
    const spyUser = jest.spyOn(User.prototype, 'save');
    await userService.createUser(mockUsername, mockPassword);
    expect(spyUser).toBeCalledTimes(1);
  });
});
