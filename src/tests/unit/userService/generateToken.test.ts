import 'dotenv/config';
import { userService } from '../../../services/userService';
import { User } from '../../../models/userModel';
import { saveUser } from '../../mocks/mockUser';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { MATCH_JWT } from '../../constants';
import { setupTests } from '../../setupTests';

const secret = process.env.TOKEN_KEY || 'secret';

setupTests('generateTokens', () => {
  test('returns new set of tokens for a user', async () => {
    const user = await saveUser();
    const { accessToken, refreshToken } = await userService.generateTokens(user);
    expect(accessToken).toMatch(MATCH_JWT);
    expect(refreshToken).toMatch(MATCH_JWT);
  });

  test('saves a refresh token to a user', async () => {
    const user = await saveUser();
    const { refreshToken } = await userService.generateTokens(user);
    const returnedUser = await User.findById(user.id);
    expect(returnedUser?.refreshToken).toEqual(refreshToken);
  });

  test('user data is saved in a access token', async () => {
    const user = await saveUser();
    const { accessToken } = await userService.generateTokens(user);
    const userData = <JwtPayload>jwt.verify(accessToken, secret);
    expect(userData.id).toBe(user.id);
    expect(userData.username).toBe(user.username);
    expect(userData.isAdmin).toBe(user.isAdmin);
  });

  test('token have expiration and issued dates', async () => {
    const user = await saveUser();
    const { accessToken, refreshToken } = await userService.generateTokens(user);
    const accessData = <JwtPayload>jwt.verify(accessToken, secret);
    const refreshData = <JwtPayload>jwt.verify(refreshToken, secret);
    expect(typeof accessData.iat).toBe('number');
    expect(typeof accessData.exp).toBe('number');
    expect(typeof refreshData.iat).toBe('number');
    expect(typeof refreshData.exp).toBe('number');
    expect(accessData.exp).toBeGreaterThan(<number>accessData.iat);
    expect(refreshData.exp).toBeGreaterThan(<number>refreshData.iat);
  });
});
