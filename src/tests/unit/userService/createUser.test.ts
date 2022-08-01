import UserService from '../../../services/userService';

import { mockUsername, mockPassword } from '../../mocks/mockUser';

import { setupTests } from '../../setupTests';

const userService = new UserService();

setupTests('createUser', () => {
  describe('error thrown when', () => {
    test('username already exists', async () => {
      await userService.createUser(mockUsername, mockPassword);
      await expect(
        userService.createUser(mockUsername, mockPassword)
      ).rejects.toThrow();
    });

    test('no username provided', async () => {
      await expect(userService.createUser('', mockPassword)).rejects.toThrow();
    });

    test('no password provided', async () => {
      await expect(userService.createUser(mockUsername, '')).rejects.toThrow();
    });
  });
});
