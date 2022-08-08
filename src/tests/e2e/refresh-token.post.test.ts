import 'dotenv/config';
import request from 'supertest';
import app from '../../app';
import { generateUserWithToken } from '../mockObjects/mockUser';
import { setupE2E } from '../setupTests';
import { StatusCodes } from 'http-status-codes';
import { userService } from '../../services/userService';
import { mockGenerateTokens } from '../mockObjects/mockUserService';
import { generateToken, mockValidToken } from '../mockObjects/mockToken';
import { MATCH_JWT } from '../constants';

setupE2E('refresh-token-e2e', () => {
  const refreshToken = mockValidToken;
  const generateTokensSpy = jest.spyOn(userService, 'generateTokens').mockImplementation(mockGenerateTokens);
  const getUserByIdSpy = jest
    .spyOn(userService, 'getUserById')
    .mockImplementation(jest.fn().mockResolvedValue(generateUserWithToken(refreshToken)));
  test(`should respond with ${StatusCodes.OK} and new set of tokens`, async () => {
    const res = await request(app).post('/refresh-token').set('Authorization', `Bearer ${refreshToken}`);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.accessToken).toMatch(MATCH_JWT);
    expect(res.body.refreshToken).toMatch(MATCH_JWT);
    expect(res.body.refreshToken).not.toBe(refreshToken);
    expect(generateTokensSpy).toBeCalledTimes(1);
    expect(getUserByIdSpy).toBeCalledTimes(1);
  });
  test(`should respond with ${StatusCodes.UNAUTHORIZED} when token doesn't match token in database`, async () => {
    const res = await request(app)
      .post('/refresh-token')
      .set('Authorization', `Bearer ${generateToken({})}`);
    console.log(res.text);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test(`should respond with ${StatusCodes.UNAUTHORIZED} when token is malformed`, async () => {
    const res = await request(app).post('/refresh-token').set('Authorization', `Bearer t`);
    console.log(res.text);
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });
});
