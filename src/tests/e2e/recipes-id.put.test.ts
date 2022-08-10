import request from 'supertest';
import app from '../../app';
import { setupE2E } from '../setupTests';
import { StatusCodes } from 'http-status-codes';
import updateValuesService from '../../services/recipeService';
import { mockGetRecipe, mockUpdateRecipe } from '../mockObjects/mockRecipeService';
import { generateToken } from '../mockObjects/mockToken';
import { mockBody, mockId, mockTitle } from '../mockObjects/mockRecipe';
import { faker } from '@faker-js/faker';

const ENDPOINT = `/recipes/${mockId}`;
const TOKEN = `Bearer ${generateToken({})}`;

setupE2E('recipes-put-e2e', () => {
  const updateRecipeSpy = jest.spyOn(updateValuesService, 'updateRecipe').mockImplementation(mockUpdateRecipe);
  const getRecipeSpy = jest.spyOn(updateValuesService, 'getRecipe').mockImplementation(mockGetRecipe);
  describe(`PUT ${ENDPOINT} should respond with`, () => {
    test(`${StatusCodes.OK} and updateValues with new values`, async () => {
      const updateValues = { id: mockId, title: mockTitle, body: mockBody };
      const res = await request(app).put(ENDPOINT).set('Authorization', TOKEN).send(updateValues);
      expect(res.status).toBe(StatusCodes.OK);
      expect(res.body).toHaveProperty('id', mockId);
      expect(res.body).toHaveProperty('title', mockTitle);
      expect(res.body).toHaveProperty('body', mockBody);
      expect(updateRecipeSpy).toBeCalledTimes(1);
      expect(getRecipeSpy).toBeCalledTimes(1);
    });

    test(`${StatusCodes.UNAUTHORIZED} when user is not logged in`, async () => {
      const res = await request(app).put(ENDPOINT);
      expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    test(`${StatusCodes.BAD_REQUEST} when id is not valid mongoId`, async () => {
      const res = await request(app).put(`/recipes/1`).set('Authorization', TOKEN);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    test(`${StatusCodes.BAD_REQUEST} when title is too short`, async () => {
      const updateValues = { id: mockId, title: faker.datatype.string(2) };
      const res = await request(app).put(ENDPOINT).set('Authorization', TOKEN).send(updateValues);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    test(`${StatusCodes.BAD_REQUEST} when title is too long`, async () => {
      const updateValues = { id: mockId, title: faker.datatype.string(25) };
      const res = await request(app).put(ENDPOINT).set('Authorization', TOKEN).send(updateValues);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    test(`${StatusCodes.BAD_REQUEST} when imageUrl is not a valid URL`, async () => {
      const updateValues = { id: mockId, imageUrl: 'food' };
      const res = await request(app).put(ENDPOINT).set('Authorization', TOKEN).send(updateValues);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    test(`${StatusCodes.BAD_REQUEST} when body is too short`, async () => {
      const updateValues = { id: mockId, body: faker.datatype.string(10) };
      const res = await request(app).put(ENDPOINT).set('Authorization', TOKEN).send(updateValues);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    test(`${StatusCodes.BAD_REQUEST} when body is too long`, async () => {
      const updateValues = { id: mockId, body: faker.datatype.string(1001) };
      const res = await request(app).put(ENDPOINT).set('Authorization', TOKEN).send(updateValues);
      expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
