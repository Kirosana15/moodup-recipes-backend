import request from 'supertest';
import app from '../../app';
import { mockValidToken, generateToken } from '../mockObjects/mockToken';
import { StatusCodes } from 'http-status-codes';
import { userService } from '../mockObjects/mock.userService';

jest.mock('../../services/userService', () => () => userService);
describe('GET /users should', () => {
  test(`respond with ${StatusCodes.INTERNAL_SERVER_ERROR} when error is thrown`, async () => {
    const res = await request(app).get('/users').set('Authorization', `Bearer ${mockValidToken}`);
    expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });
  test(`respond with ${StatusCodes.FORBIDDEN} when user is not an admin`, async () => {
    const token = generateToken({ isAdmin: false });
    const res = await request(app).get('/users').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
  });
  test(`respond with ${StatusCodes.UNAUTHORIZED} when invalid token is presented`, async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });
  test(`respond with ${StatusCodes.OK} and user list`, async () => {
    const res = await request(app).get('/users').set('Authorization', `Bearer ${mockValidToken}`);
    expect(res.statusCode).toBe(StatusCodes.OK);
  });
});
