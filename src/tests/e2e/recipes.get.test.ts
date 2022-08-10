import request from 'supertest';
import app from '../../app';
import { setupE2E } from '../setupTests';
import { StatusCodes } from 'http-status-codes';
import recipeService from '../../services/recipeService';
import { mockGetRecipesByOwner } from '../mockObjects/mockRecipeService';
import { generateToken } from '../mockObjects/mockToken';

const ENDPOINT = '/recipes';
const TOKEN = `Bearer ${generateToken({})}`;

setupE2E('recipes-get-e2e', () => {
  const getRecipesByOwnerSpy = jest.spyOn(recipeService, 'getRecipesByOwner').mockImplementation(mockGetRecipesByOwner);
  describe(`GET ${ENDPOINT} should respond with`, () => {
    test(`${StatusCodes.OK} and list of users recipes`, async () => {
      const res = await request(app).get(ENDPOINT).set('Authorization', TOKEN);
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toHaveLength(10);
      expect(res.body[0]).toHaveProperty('ownerId');
      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0]).toHaveProperty('imageUrl');
      expect(res.body[0]).toHaveProperty('body');
      expect(res.body[0]).toHaveProperty('createdAt');
      expect(getRecipesByOwnerSpy).toBeCalled();
    });

    test(`${StatusCodes.UNAUTHORIZED} when user is not logged in`, async () => {
      const res = await request(app).get(ENDPOINT);
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    test(`${StatusCodes.BAD_REQUEST} when limit is not a number`, async () => {
      const res = await request(app)
        .get(ENDPOINT + '?limit=NaN')
        .set('Authorization', TOKEN);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    test(`${StatusCodes.BAD_REQUEST} when page is not a number`, async () => {
      const res = await request(app)
        .get(ENDPOINT + '?page=NaN')
        .set('Authorization', TOKEN);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
