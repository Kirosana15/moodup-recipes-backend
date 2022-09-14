import request from 'supertest';
import app from '../../app';
import { setupE2E } from '../setupTests';
import { StatusCodes } from 'http-status-codes';
import recipeService from '../../services/recipeService';
import { mockGetRecipe, mockRemoveRecipe } from '../mockObjects/mockRecipeService';
import { generateToken } from '../mockObjects/mockToken';
import { mockId } from '../mockObjects/mockRecipe';

const ENDPOINT = `/recipes/${mockId}`;
const TOKEN = `Bearer ${generateToken({})}`;

setupE2E('recipes-id-delete-e2e', () => {
  const removeRecipeSpy = jest.spyOn(recipeService, 'removeRecipe').mockImplementation(mockRemoveRecipe);
  const getRecipeSpy = jest.spyOn(recipeService, 'getRecipe').mockImplementation(mockGetRecipe);
  describe(`DELETE ${ENDPOINT} should respond with`, () => {
    test(`${StatusCodes.OK} and a removed recipe`, async () => {
      const res = await request(app).delete(ENDPOINT).set('Authorization', TOKEN);
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toHaveProperty('title');
      expect(removeRecipeSpy).toBeCalledTimes(1);
      expect(getRecipeSpy).toBeCalledTimes(1);
    });

    test(`${StatusCodes.UNAUTHORIZED} when user is not logged in`, async () => {
      const res = await request(app).delete(ENDPOINT);
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    test(`${StatusCodes.BAD_REQUEST} when id is not valid mongoId`, async () => {
      const res = await request(app).delete(`/recipes/1`).set('Authorization', TOKEN);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
