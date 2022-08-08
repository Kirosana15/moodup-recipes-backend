import { generateToken } from './mockToken';
import { generateUser, generateUsers, mockId } from './mockUser';

export const mockComparePassword = jest.fn().mockResolvedValue(true);
export const mockGenerateTokens = jest
  .fn()
  .mockResolvedValue({ accessToken: generateToken({}), refreshToken: generateToken({}) });
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
