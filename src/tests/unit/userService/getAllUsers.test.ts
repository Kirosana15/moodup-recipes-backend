import { saveUsers } from '../../mocks/mockUser';
import UserService from '../../../services/userService';
import { setupTests } from '../../setupTests';

const userService = new UserService();

setupTests('getAllUsers', () => {
  test('returns existing users', async () => {
    await saveUsers(3);
    const users = await userService.getAllUsers();
    expect(users).toHaveLength(3);
  });

  test('returns empty array if no users present', async () => {
    const users = await userService.getAllUsers();
    expect(users).toEqual([]);
  });

  test('return paginated results', async () => {
    await saveUsers(20);
    let users = await userService.getAllUsers();
    expect(users).toHaveLength(10);
    users = await userService.getAllUsers(undefined, 20);
    expect(users).toHaveLength(20);
    const pagedUsers = await userService.getAllUsers(2, 5);
    expect(pagedUsers[0]).toEqual(users[5]);
  });

  test('results are sorted by descending creation time', async () => {
    await saveUsers(5);
    const users = await userService.getAllUsers();
    expect(users).toStrictEqual(
      [...users].sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime();
      })
    );
  });
});
