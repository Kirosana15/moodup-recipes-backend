import 'dotenv/config';
import request from 'supertest';
import app from '../../app';
import {
  generateUser,
  mockPassword,
  mockToken,
  mockUsername,
} from '../mockObjects/mockUser';
import { setupTests } from '../setupTests';
import { StatusCodes } from 'http-status-codes';
import UserService from '../../services/userService';

setupTests('login-e2e', () => {
  describe('POST /login responds', () => {
    const getUserSpy = jest
      .spyOn(UserService.prototype, 'getUser')
      .mockImplementation((): any => {
        return generateUser();
      });
    const comparePasswordSpy = jest
      .spyOn(UserService.prototype, 'comparePassword')
      .mockImplementation(() => Promise.resolve(true));
    const generateTokenSpy = jest
      .spyOn(UserService.prototype, 'generateToken')
      .mockImplementation(() => {
        return Promise.resolve({
          accessToken: mockToken,
          refreshToken: mockToken,
        });
      });

    test('with set of tokens for a logged in user', async () => {
      const res = await request(app)
        .post('/login')
        .send({ username: mockUsername, password: mockPassword })
        .expect(StatusCodes.OK);
      expect(getUserSpy).toBeCalledTimes(1);
      expect(comparePasswordSpy).toBeCalledTimes(1);
      expect(generateTokenSpy).toBeCalledTimes(1);
      expect(res.body.accessToken).toBe(mockToken);
      expect(res.body.refreshToken).toBe(mockToken);
    });

    test(`with ${StatusCodes.BAD_REQUEST} when username is not provided`, async () => {
      const res = await request(app)
        .post('/login')
        .send({ password: mockPassword })
        .expect(StatusCodes.BAD_REQUEST);
      expect(generateTokenSpy).not.toBeCalled();
      expect(getUserSpy).not.toBeCalled();
      expect(comparePasswordSpy).not.toBeCalled();
      expect(res.body.errors).toBeDefined();
    });

    test(`with ${StatusCodes.BAD_REQUEST} when password is not provided`, async () => {
      const res = await request(app)
        .post('/login')
        .send({ username: mockUsername })
        .expect(StatusCodes.BAD_REQUEST);
      expect(generateTokenSpy).not.toBeCalled();
      expect(getUserSpy).not.toBeCalled();
      expect(comparePasswordSpy).not.toBeCalled();
      expect(res.body.errors).toBeDefined();
    });

    test(`with ${StatusCodes.UNAUTHORIZED} and error message "Invalid credentials" when wrong credentials are entered`, async () => {
      getUserSpy.mockImplementationOnce(() => Promise.resolve(null));
      const resNoUser = await request(app)
        .post('/login')
        .send({ username: mockUsername, password: mockPassword })
        .expect(StatusCodes.UNAUTHORIZED);

      comparePasswordSpy.mockImplementationOnce(() => Promise.resolve(false));
      const resBadPassword = await request(app)
        .post('/login')
        .send({ username: mockUsername, password: mockPassword })
        .expect(StatusCodes.UNAUTHORIZED);

      expect(generateTokenSpy).not.toBeCalled();
      expect(getUserSpy).toBeCalledTimes(2);
      expect(comparePasswordSpy).toBeCalledTimes(2);
      expect(resNoUser.text).toEqual(resBadPassword.text);
      expect(resNoUser.text).toEqual('Invalid credentials');
    });

    test(`with ${StatusCodes.INTERNAL_SERVER_ERROR} when userService throws an error`, () => {
      comparePasswordSpy.mockRejectedValueOnce(new Error(''));
      request(app)
        .post('/login')
        .send({ username: mockUsername, password: mockPassword })
        .expect(StatusCodes.INTERNAL_SERVER_ERROR)
        .end();
    });

    test(`with ${StatusCodes.BAD_REQUEST} when username validation fails`, async () => {
      await request(app)
        .post('/login')
        .send({ username: 'Mo', password: mockPassword })
        .expect(StatusCodes.BAD_REQUEST);
    });

    test(`with ${StatusCodes.BAD_REQUEST} when password validation fails`, async () => {
      await request(app)
        .post('/login')
        .send({ username: mockUsername, password: 'pass' })
        .expect(StatusCodes.BAD_REQUEST);
    });
  });
});
