import request from 'supertest';
import app from '../../app';
import { setupE2E } from '../setupTests';
import { StatusCodes } from 'http-status-codes';
import recipeService from '../../services/recipeService';
import { mockCreateRecipe } from '../mockObjects/mockRecipeService';
import { generateToken } from '../mockObjects/mockToken';
import { createRecipe } from '../mockObjects/mockRecipe';
import { faker } from '@faker-js/faker';

const ENDPOINT = '/recipes';
const TOKEN = `Bearer ${generateToken({})}`;

setupE2E('recipes-get-e2e', () => {
  const createRecipeSpy = jest.spyOn(recipeService, 'createRecipe').mockImplementation(mockCreateRecipe);
  describe(`POST ${ENDPOINT} should respond with`, () => {
    test(`${StatusCodes.CREATED} and a new recipe`, async () => {
      const recipe = createRecipe();
      const res = await request(app).post(ENDPOINT).set('Authorization', TOKEN).send(recipe);
      expect(res.status).toBe(StatusCodes.CREATED);
      const returnedRecipe = (({ title, imageUrl, body }) => ({ title, imageUrl, body }))(res.body);
      expect(returnedRecipe).toEqual(recipe);
      expect(createRecipeSpy).toBeCalledTimes(1);
    });

    test(`${StatusCodes.UNAUTHORIZED} when user is not logged in`, async () => {
      const res = await request(app).post(ENDPOINT);
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    test(`${StatusCodes.BAD_REQUEST} when title is too short`, async () => {
      const recipe = createRecipe(faker.datatype.string(2));
      const res = await request(app).post(ENDPOINT).set('Authorization', TOKEN).send(recipe);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    test(`${StatusCodes.BAD_REQUEST} when title is too long`, async () => {
      const recipe = createRecipe(faker.datatype.string(25));
      const res = await request(app).post(ENDPOINT).set('Authorization', TOKEN).send(recipe);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    test(`${StatusCodes.BAD_REQUEST} when imageUrl is not a valid URL`, async () => {
      const recipe = createRecipe(undefined, 'food');
      const res = await request(app).post(ENDPOINT).set('Authorization', TOKEN).send(recipe);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    test(`${StatusCodes.BAD_REQUEST} when body is too short`, async () => {
      const recipe = createRecipe(undefined, undefined, faker.datatype.string(10));
      const res = await request(app).post(ENDPOINT).set('Authorization', TOKEN).send(recipe);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    test(`${StatusCodes.BAD_REQUEST} when body is too long`, async () => {
      const recipe = createRecipe(undefined, undefined, faker.datatype.string(1001));
      const res = await request(app).post(ENDPOINT).set('Authorization', TOKEN).send(recipe);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
