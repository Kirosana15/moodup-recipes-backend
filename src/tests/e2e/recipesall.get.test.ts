import request from 'supertest';
import app from '../../app';
import { setupE2E } from '../setupTests';
import { StatusCodes } from 'http-status-codes';
import recipeService from '../../services/recipeService';
import { mockGetAllRecipes } from '../mockObjects/mockRecipeService';
import { generateToken } from '../mockObjects/mockToken';

const ENDPOINT = '/recipes/all';
const TOKEN = `Bearer ${generateToken({ isAdmin: true })}`;

setupE2E('recipes-all-get-e2e', () => {
  const getAllRecipesSpy = jest.spyOn(recipeService, 'getAllRecipes').mockImplementation(mockGetAllRecipes);
  describe(`GET ${ENDPOINT} should respond with`, () => {
    test(`${StatusCodes.OK} and a list of all recipes`, async () => {
      const res = await request(app).get(ENDPOINT).set('Authorization', TOKEN);
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toHaveLength(10);
      expect(getAllRecipesSpy).toBeCalledTimes(1);
    });

    test(`${StatusCodes.UNAUTHORIZED} when user is not logged in`, async () => {
      const res = await request(app).get(ENDPOINT);
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    test(`${StatusCodes.BAD_REQUEST} when limit is not a number`, async () => {
      const res = await request(app).get(ENDPOINT + '?limit=NaN');
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    test(`${StatusCodes.BAD_REQUEST} when page is not a number`, async () => {
      const res = await request(app).get(ENDPOINT + '?page=NaN');
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
});
