import 'dotenv/config';
import request from 'supertest';
import app from '../../app';
import { mockPassword, mockUsername } from '../mockObjects/mockUser';
import { setupTests } from '../setupTests';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import { userService } from '../../services/userService';

setupTests('register-e2e', () => {
  describe('POST /register should respond', () => {
    const createUserSpy = jest.spyOn(userService, 'createUser').mockImplementation((): any => {
      return Promise.resolve({ username: mockUsername, password: 'hash' });
    });

    test('with created user with hashed password', async () => {
      const res = await request(app).post('/register').send({ username: mockUsername, password: mockPassword });

      expect(res.statusCode).toBe(StatusCodes.CREATED);
      expect(bcrypt.hash).toBeCalledTimes(1);
      expect(createUserSpy).toBeCalledTimes(1);
      expect(res.body.username).toBe(mockUsername);
      expect(res.body.password).toBe('hash');
    });

    test('with 400 when username is not provided', async () => {
      const res = await request(app).post('/register').send({ password: mockPassword });

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(bcrypt.hash).toBeCalledTimes(0);
      expect(res.body.errors).toBeDefined();
    });

    test('with 400 when password is not provided', async () => {
      const res = await request(app).post('/register').send({ username: mockUsername });

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(bcrypt.hash).toBeCalledTimes(0);
      expect(res.body.errors).toBeDefined();
    });

    test('with 400 and error message "User already exists" when username already in database', async () => {
      createUserSpy.mockImplementationOnce(() => {
        return Promise.reject({ code: 11000 });
      });
      const res = await request(app).post('/register').send({ username: mockUsername, password: mockPassword });

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(createUserSpy).toBeCalledTimes(1);
      expect(res.text).toEqual('User already exists');
    });

    test('with INTERNAL_SERVER_ERROR when userService throws an error', async () => {
      createUserSpy.mockImplementation(() => {
        throw { code: 1 };
      });
      const errRes = await request(app).post('/register').send({ username: mockUsername, password: mockPassword });

      expect(errRes.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(errRes.text).toBe(ReasonPhrases.INTERNAL_SERVER_ERROR);
      expect(createUserSpy).toThrow();
    });

    test(`with ${StatusCodes.BAD_REQUEST} when username validation fails`, async () => {
      const res = await request(app).post('/register').send({ username: 'Mo', password: mockPassword });

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    test(`with ${StatusCodes.BAD_REQUEST} when password validation fails`, async () => {
      const res = await request(app).post('/register').send({ username: mockUsername, password: 'pass' });

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
