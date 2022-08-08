import request from 'supertest';
import app from '../../app';
import { mockValidToken, generateToken } from '../mockObjects/mockToken';
import { StatusCodes } from 'http-status-codes';
import { setupE2E } from '../setupTests';
import { userService } from '../../services/userService';
import { mockGetAllUsers } from '../mockObjects/mockUserService';

const ENDPOINT = '/users';
const TOKEN = `Bearer ${mockValidToken}`;

setupE2E('usersget-e2e', () => {
  const getAllUsersSpy = jest.spyOn(userService, 'getAllUsers').mockImplementation(mockGetAllUsers);
  describe('GET /users should', () => {
    test(`respond with ${StatusCodes.INTERNAL_SERVER_ERROR} when error is thrown`, async () => {
      getAllUsersSpy.mockRejectedValueOnce('error');
      const res = await request(app).get(ENDPOINT).set('Authorization', TOKEN);
      expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
    test(`respond with ${StatusCodes.FORBIDDEN} when user is not an admin`, async () => {
      const token = generateToken({ isAdmin: false });
      const res = await request(app).get(ENDPOINT).set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    });
    test(`respond with ${StatusCodes.UNAUTHORIZED} when invalid token is presented`, async () => {
      const res = await request(app).get(ENDPOINT);
      expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
    test(`respond with ${StatusCodes.OK} and user list`, async () => {
      const res = await request(app).get(ENDPOINT).set('Authorization', TOKEN);
      expect(res.statusCode).toBe(StatusCodes.OK);
    });

    test(`respond with ${StatusCodes.BAD_REQUEST} when page is not an int`, async () => {
      const res = await request(app)
        .get(ENDPOINT + '?page=string')
        .set('Authorization', TOKEN);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
    test(`respond with ${StatusCodes.BAD_REQUEST} when limit is not an int`, async () => {
      const res = await request(app)
        .get(ENDPOINT + '?limit=string')
        .set('Authorization', TOKEN);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
