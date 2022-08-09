import { setupE2E } from '../setupTests';
import request from 'supertest';
import app from '../../app';
import { generateToken } from '../mockObjects/mockToken';
import { mockUsername } from '../mockObjects/mockUser';
import { StatusCodes } from 'http-status-codes';

const ENDPOINT = '/profile';

setupE2E('profile-get-e2e', () => {
  test(`should respond with ${StatusCodes.OK} and user information for logged in user`, async () => {
    const res = await request(app)
      .get(ENDPOINT)
      .set('Authorization', `Bearer ${generateToken({ username: mockUsername, isAdmin: false })}`);
    expect(res.status).toBe(StatusCodes.OK);
    expect(res.body.username).toBe(mockUsername);
    expect(res.body.isAdmin).toBeFalsy();
  });

  test(`should respond with ${StatusCodes.UNAUTHORIZED} if user is not logged in`, async () => {
    const res = await request(app).get(ENDPOINT);
    expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});
