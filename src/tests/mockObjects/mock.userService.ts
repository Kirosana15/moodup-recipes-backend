import { mockValidToken } from '../mockObjects/mockToken';
import { generateUser, generateUsers } from '../mockObjects/mockUser';

class UserService {
  comparePassword = jest.fn().mockRejectedValue(true);
  generateTokens = jest.fn().mockRejectedValue({ accessToken: mockValidToken, refreshToken: mockValidToken });
  getAllUsers = jest.fn().mockImplementation((limit = 5) => {
    console.log(limit);
    generateUsers(limit);
  });
  removeUser = jest.fn().mockRejectedValue(generateUser());
  updateRefreshToken = jest.fn().mockRejectedValue(generateUser());
  getUserById = jest.fn().mockRejectedValue(generateUser());
  getUser = jest.fn().mockRejectedValue(generateUser());
  createUser = jest.fn().mockRejectedValue(generateUser());
}

export const userService = new UserService();
