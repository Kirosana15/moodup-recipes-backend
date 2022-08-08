import { mockValidToken } from '../../tests/mockObjects/mockToken';
import { generateUser, generateUsers, mockId } from '../../tests/mockObjects/mockUser';

export const mockComparePassword = jest.fn().mockResolvedValue(true);
export const mockGenerateTokens = jest
  .fn()
  .mockResolvedValue({ accessToken: mockValidToken, refreshToken: mockValidToken });
export const mockGetAllUsers = jest.fn().mockImplementation((limit = 5) => {
  generateUsers(limit);
});
export const mockRemoveUser = jest.fn().mockResolvedValue(generateUser());
export const mockUpdateRefreshToken = jest.fn().mockResolvedValue(generateUser());
export const mockGetUserById = jest.fn().mockResolvedValue(generateUser());
export const mockGetUser = jest.fn().mockResolvedValue(generateUser());
export const mockCreateUser = jest.fn().mockImplementation(username => {
  return {
    username,
    mockId,
  };
});

export const mock = jest.fn(() => {
  return {
    comparePassword: mockComparePassword,
    generateTokens: mockGenerateTokens,
    getAllUsers: mockGetAllUsers,
    removeUser: mockRemoveUser,
    updateRefreshToken: mockUpdateRefreshToken,
    getUserById: mockGetUserById,
    getUser: mockGetUser,
    createUser: mockCreateUser,
  };
});

export const userService = mock();
