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
  test('should return a recipe with specified Id', async () => {
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
  describe('should not return recipe', () => {
    test('when id does not exists', async () => {
      expect(await recipeService.getRecipe(mockId)).toBeNull();
    });

    test('when no id is provided', async () => {
      await expect(recipeService.getRecipe('')).rejects.toThrow();
    });
  });
});
