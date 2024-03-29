import 'dotenv/config';
import request from 'supertest';
import app from '../../app';
import { mockPassword, mockUsername, mockBasicAuthString } from '../mockObjects/mockUser';
import { setupE2E } from '../setupTests';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { userService } from '../../services/userService';
import { mockComparePassword, mockGenerateTokens, mockGetUser } from '../mockObjects/mockUserService';
import { faker } from '@faker-js/faker';

const ENDPOINT = '/login';

setupE2E('login-e2e', () => {
  const generateTokensSpy = jest.spyOn(userService, 'generateTokens').mockImplementation(mockGenerateTokens);
  const getUsersSpy = jest.spyOn(userService, 'getUser').mockImplementation(mockGetUser);
  const comparePasswordSpy = jest.spyOn(userService, 'comparePassword').mockImplementation(mockComparePassword);
  describe('POST /login responds', () => {
    test('with set of tokens for a logged in user', async () => {
      const res = await request(app)
        .post(ENDPOINT)

        .set('Authorization', mockBasicAuthString(mockUsername, mockPassword));
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    test(`with ${StatusCodes.UNAUTHORIZED} when username is not provided`, async () => {
      const res = await request(app).post(ENDPOINT).set('Authorization', mockBasicAuthString('', mockPassword));
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    test(`with ${StatusCodes.UNAUTHORIZED} when password is not provided`, async () => {
      const res = await request(app).post(ENDPOINT).set('Authorization', mockBasicAuthString(mockUsername, ''));
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
    test(`with ${StatusCodes.UNAUTHORIZED} and error message "Invalid credentials" when wrong credentials are entered`, async () => {
      getUsersSpy.mockResolvedValueOnce(null);
      const resNoUser = await request(app)
        .post(ENDPOINT)
        .set('Authorization', mockBasicAuthString(mockUsername, mockPassword));
      comparePasswordSpy.mockResolvedValueOnce(false);
      const resBadPassword = await request(app)
        .post(ENDPOINT)
        .set('Authorization', mockBasicAuthString(mockUsername, mockPassword));

      expect(resNoUser.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(resBadPassword.statusCode).toBe(StatusCodes.UNAUTHORIZED);
      expect(resNoUser.text).toEqual(resBadPassword.text);
      expect(resNoUser.text).toEqual(ReasonPhrases.UNAUTHORIZED);
    });

    test(`with ${StatusCodes.INTERNAL_SERVER_ERROR} when userService throws an error`, async () => {
      generateTokensSpy.mockImplementationOnce(() => {
        throw new Error('test');
      });
      const res = await request(app)
        .post(ENDPOINT)
        .set('Authorization', mockBasicAuthString(mockUsername, mockPassword));
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.text).toBe(ReasonPhrases.INTERNAL_SERVER_ERROR);
    });
    describe('validation tests', () => {
      test(`with ${StatusCodes.BAD_REQUEST} when username is too short`, async () => {
        const res = await request(app).post(ENDPOINT).set('Authorization', mockBasicAuthString('a', mockPassword));
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.errors).toBeTruthy();
      });
      test(`with ${StatusCodes.BAD_REQUEST} when username is too long`, async () => {
        const res = await request(app)
          .post(ENDPOINT)
          .set('Authorization', mockBasicAuthString('1234567890123456', mockPassword));
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.errors).toBeTruthy();
      });
      test(`with ${StatusCodes.BAD_REQUEST} when username contains illegal characters`, async () => {
        const res = await request(app)
          .post(ENDPOINT)
          .set('Authorization', mockBasicAuthString('12345678*', mockPassword));
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.errors).toBeTruthy();
      });
      test(`with ${StatusCodes.BAD_REQUEST} when password is too short`, async () => {
        const res = await request(app).post(ENDPOINT).set('Authorization', mockBasicAuthString(mockUsername, '1234'));
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.errors).toBeTruthy();
      });
      test(`with ${StatusCodes.BAD_REQUEST} when password is too long`, async () => {
        const password = faker.internet.password(201);
        const res = await request(app).post(ENDPOINT).set('Authorization', mockBasicAuthString(mockUsername, password));
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body.errors).toBeTruthy();
      });
    });
  });
});
