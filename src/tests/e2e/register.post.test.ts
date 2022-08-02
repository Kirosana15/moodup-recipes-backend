import 'dotenv/config';
import request from 'supertest';
import app from '../../app';
import { mockPassword, mockUsername } from '../mockObjects/mockUser';
import { setupTests } from '../setupTests';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import UserService from '../../services/userService';

setupTests('register-e2e', () => {
  describe('POST /register responds', () => {
    const createSpy = jest.spyOn(UserService.prototype, 'createUser');
    test('with created user with hashed password', async () => {
      const res = await request(app)
        .post('/register')
        .send({ username: mockUsername, password: mockPassword })
        .expect(StatusCodes.CREATED);
      expect(bcrypt.hash).toBeCalledTimes(1);
      expect(createSpy).toBeCalledTimes(1);
      expect(res.body.username).toBe(mockUsername);
      expect(res.body.password).toBe('hash');
    });
    test('with 400 when username is not provided', async () => {
      const res = await request(app)
        .post('/register')
        .send({ password: mockPassword })
        .expect(StatusCodes.BAD_REQUEST);
      expect(bcrypt.hash).toBeCalledTimes(0);
      expect(res.body.errors).toBeDefined();
    });
    test('with 400 when password is not provided', async () => {
      const res = await request(app)
        .post('/register')
        .send({ username: mockUsername })
        .expect(StatusCodes.BAD_REQUEST);
      expect(bcrypt.hash).toBeCalledTimes(0);
      expect(res.body.errors).toBeDefined();
    });
    test('with 400 and error message "User already exists"', async () => {
      await request(app)
        .post('/register')
        .send({ username: mockUsername, password: mockPassword })
        .expect(StatusCodes.CREATED);
      expect(createSpy).toBeCalledTimes(1);
      const res = await request(app)
        .post('/register')
        .send({ username: mockUsername, password: mockPassword })
        .expect(StatusCodes.BAD_REQUEST);
      expect(createSpy).toBeCalledTimes(2);
      expect(res.text).toEqual('User already exists');
    });
    test('with INTERNAL_SERVER_ERROR when userService throws an error', async () => {
      createSpy.mockImplementation(() => {
        throw { code: 1 };
      });
      const errRes = await request(app)
        .post('/register')
        .send({ username: mockUsername, password: mockPassword })
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(errRes.text).toBe(ReasonPhrases.INTERNAL_SERVER_ERROR);
      expect(createSpy).toThrow();
    });
  });
});
