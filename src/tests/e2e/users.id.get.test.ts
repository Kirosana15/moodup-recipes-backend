import { setupE2E } from '../setupTests';
import request from 'supertest';
import app from '../../app';
import { StatusCodes } from 'http-status-codes';
import { userService } from '../../services/userService';
import { mockGetUserById } from '../mockObjects/mockUserService';
import { mockId } from '../mockObjects/mockUser';
import { mockValidToken } from '../mockObjects/mockToken';

const TOKEN = `Bearer ${mockValidToken}`;
const ENDPOINT = `/users/${mockId}`;

setupE2E('usersidget-e2e', () => {
  const getUserByIdSpy = jest.spyOn(userService, 'getUserById').mockImplementation(mockGetUserById);
  describe('GET /users/{id} should', () => {
    test(`respond with ${StatusCodes.INTERNAL_SERVER_ERROR} when error is thrown`, async () => {
      getUserByIdSpy.mockRejectedValueOnce('test');
      const res = await request(app).get(ENDPOINT).set('Authorization', TOKEN);
      expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    test(`respond with ${StatusCodes.NOT_FOUND} when user does not exist`, async () => {
      getUserByIdSpy.mockResolvedValueOnce(null);
      const res = await request(app).get(ENDPOINT).set('Authorization', TOKEN);
      expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
      expect(res.text).toEqual('User not found');
    });

    test(`respond with ${StatusCodes.OK} and user data`, async () => {
      const res = await request(app).get(ENDPOINT).set('Authorization', TOKEN);
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.body.username).toBeDefined();
    });

    test(`respond with ${StatusCodes.BAD_REQUEST} when id is not a valid mongoId`, async () => {
      const res = await request(app).get('/users/1').set('Authorization', TOKEN);
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
