import { setupE2E } from '../setupTests';
import request from 'supertest';
import app from '../../app';
import { StatusCodes } from 'http-status-codes';
import { userService } from '../../services/userService';
import { mockRemoveUser } from '../mockObjects/mockUserService';
import { generateMockId, mockId } from '../mockObjects/mockUser';
import { generateToken, mockValidToken } from '../mockObjects/mockToken';

const ENDPOINT = `/users/${mockId}`;
const TOKEN = `Bearer ${mockValidToken}`;

setupE2E('usersiddelete-e2e', () => {
  const removeUserSpy = jest.spyOn(userService, 'removeUser').mockImplementation(mockRemoveUser);
  describe('DELETE /users/{id} should', () => {
    test(`respond with ${StatusCodes.INTERNAL_SERVER_ERROR} when error is thrown`, async () => {
      removeUserSpy.mockRejectedValueOnce('test');
      const res = await request(app).delete(ENDPOINT).set('Authorization', TOKEN);

      expect(res.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    test(`respond with ${StatusCodes.NOT_FOUND} when id does not exist`, async () => {
      removeUserSpy.mockResolvedValueOnce(null);
      const res = await request(app).delete(ENDPOINT).set('Authorization', TOKEN);

      expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    test(`respond with ${StatusCodes.FORBIDDEN} when user is not an admin and trying to delete another user`, async () => {
      const res = await request(app)
        .delete(`/users/${generateMockId()}`)
        .set('Authorization', `Bearer ${generateToken({ isAdmin: false, id: mockId })}`);

      expect(res.statusCode).toBe(StatusCodes.FORBIDDEN);
    });
    test(`respond with ${StatusCodes.OK} and deleted user if user is an admin`, async () => {
      const res = await request(app)
        .delete(`/users/${generateMockId()}`)
        .set('Authorization', `Bearer ${generateToken({ isAdmin: true, id: mockId })}`);

      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.body.username).toBeDefined();
    });
    test(`respond with ${StatusCodes.OK} and deleted user if user to delete is the same as logged in user`, async () => {
      const res = await request(app)
        .delete(ENDPOINT)
        .set('Authorization', `Bearer ${generateToken({ isAdmin: false, id: mockId })}`);

      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.body.username).toBeDefined();
    });
    test(`respond with ${StatusCodes.BAD_REQUEST} if id is not valid mongoId`, async () => {
      const res = await request(app)
        .delete(`/users/1`)
        .set('Authorization', `Bearer ${generateToken({ isAdmin: false, id: mockId })}`);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
