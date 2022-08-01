import { IRecipe } from '../../../interfaces/recipe';
import { Recipe } from '../../../models/recipeModel';
import RecipeService from '../../../services/recipeService';

import { mockBody, mockId, mockImage, mockTitle } from '../../mocks/mockRecipe';

import { setupTests } from '../../setupTests';

const recipeService = new RecipeService();

setupTests('createRecipe', () => {
  test('save new Recipe in a database', async () => {
    await recipeService.createRecipe(mockId, mockTitle, mockImage, mockBody);
    const recipe = <IRecipe>await Recipe.findOne({ title: mockTitle });
    expect(recipe).toBeDefined();
    expect(recipe.title).toBe(mockTitle);
    expect(recipe.body).toBe(mockBody);
    expect(recipe.ownerId).toBe(mockId);
    expect(recipe.imageUrl).toBe(mockImage);
  });

  describe('error thrown when', () => {
    test('no title provided', async () => {
      await expect(
        recipeService.createRecipe(mockId, '', mockImage, mockBody)
      ).rejects.toThrow();
    });

    test('no password provided', async () => {
      await expect(
        recipeService.createRecipe(mockId, mockTitle, mockImage, '')
      ).rejects.toThrow();
    });
  });

  test('runs Recipe.save()', async () => {
    const spyRecipe = jest.spyOn(Recipe.prototype, 'save');
    await recipeService.createRecipe(mockId, mockTitle, mockImage, mockBody);
    expect(spyRecipe).toBeCalledTimes(1);
  });
});
