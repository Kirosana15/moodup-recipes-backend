import { IRecipe } from '../../../interfaces/recipe';
import { Recipe } from '../../../models/recipeModel';
import RecipeService from '../../../services/recipeService';

import {
  mockBody,
  mockDate,
  mockId,
  mockImage,
  mockTitle,
} from '../../mocks/mockRecipe';

import { setupTests } from '../../setupTests';

const recipeService = new RecipeService();

setupTests('getRecipe', () => {
  test('gets _id, ownerId, title, imageUrl, body and createdAt of a recipe with specified Id', async () => {
    const newRecipe = <IRecipe>await new Recipe({
      ownerId: mockId,
      title: mockTitle,
      imageUrl: mockImage,
      body: mockBody,
      createdAt: mockDate,
    }).save();
    const recipe = await recipeService.getRecipe(newRecipe._id);

    expect(recipe?.ownerId).toBe(mockId);
    expect(recipe?.title).toBe(mockTitle);
    expect(recipe?.imageUrl).toBe(mockImage);
    expect(recipe?.body).toBe(mockBody);
    expect(recipe?.createdAt).toStrictEqual(mockDate);
  });
  test("doesn't return recipe when id doesn't exists", async () => {
    expect(await recipeService.getRecipe(mockId)).toBeNull();
  });

  test('no id provided', async () => {
    await expect(recipeService.getRecipe('')).rejects.toThrow();
  });
});
