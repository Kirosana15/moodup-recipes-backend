import 'dotenv/config';
import UserService from '../../../services/userService';
import { User } from '../../../models/userModel';
import { IUser } from '../../../interfaces/user';
import { mockUser } from '../../mocks/mockUser';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  clearAllCollections,
  closeConnection,
  connectToDb,
  MATCH_JWT,
} from '../../consts';

const userService = new UserService();
const secret = process.env.TOKEN_KEY || 'secret';

describe('Testing generateToken()', () => {
  beforeAll(() => {
    connectToDb('generateToken-test');
  });
  afterEach(() => {
    clearAllCollections();
  });
  afterAll(() => {
    closeConnection();
  });

  test('returns new set of tokens for a user', async () => {
    const user = <IUser>new User(new mockUser());
    const { accessToken, refreshToken } = await userService.generateToken(user);
    expect(accessToken).toMatch(MATCH_JWT);
    expect(refreshToken).toMatch(MATCH_JWT); //matches a JWT token
  });
  test('saves a refresh token to a user', async () => {
    let user = <IUser>await new User(new mockUser()).save();
    const { refreshToken } = await userService.generateToken(user);
    user = <IUser>await User.findById(user.id);
    expect(user.refreshToken).toEqual(refreshToken);
  });
  test('user data is saved in a access token', async () => {
    const user = <IUser>await new User(new mockUser()).save();
    const { accessToken } = await userService.generateToken(user);
    const userData = <JwtPayload>jwt.verify(accessToken, secret);
    expect(userData.id).toBe(user.id);
    expect(userData.username).toBe(user.username);
    expect(userData.isAdmin).toBe(user.isAdmin);
  });
  test('token have expiration and issued dates', async () => {
    const user = <IUser>new User(new mockUser());
    const { accessToken, refreshToken } = await userService.generateToken(user);
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
