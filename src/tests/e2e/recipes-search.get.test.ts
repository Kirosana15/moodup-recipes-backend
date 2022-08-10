import request from 'supertest';
import app from '../../app';
import { setupE2E } from '../setupTests';
import { StatusCodes } from 'http-status-codes';
import recipeService from '../../services/recipeService';
import { mockGetRecipesByTitle } from '../mockObjects/mockRecipeService';
import { generateToken } from '../mockObjects/mockToken';
import { mockQuery } from '../mockObjects/mockRecipe';

const ENDPOINT = '/recipes/search/';
const TOKEN = `Bearer ${generateToken({})}`;

setupE2E('recipes-get-e2e', () => {
  const getRecipesByTitleSpy = jest.spyOn(recipeService, 'getRecipesByTitle').mockImplementation(mockGetRecipesByTitle);
  describe(`GET ${ENDPOINT + ':query'} should respond with`, () => {
    test(`${StatusCodes.OK} and a recipe`, async () => {
      const res = await request(app)
        .get(ENDPOINT + mockQuery)
        .set('Authorization', TOKEN);

      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body[0]).toHaveProperty('title');
      expect(getRecipesByTitleSpy).toBeCalledTimes(1);
    });

    test(`${StatusCodes.UNAUTHORIZED} when user is not logged in`, async () => {
      const res = await request(app).get(ENDPOINT + mockQuery);

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    test(`${StatusCodes.BAD_REQUEST} when id query is not valid`, async () => {
      const res = await request(app)
        .get(ENDPOINT + '#$&*(%&@(_')
        .set('Authorization', TOKEN);

      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    test(`${StatusCodes.BAD_REQUEST} when limit is not a number`, async () => {
      const res = await request(app).get(ENDPOINT + mockQuery + '?limit=NaN');

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    test(`${StatusCodes.BAD_REQUEST} when page is not a number`, async () => {
      const res = await request(app).get(ENDPOINT + mockQuery + '?page=NaN');

      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
});
