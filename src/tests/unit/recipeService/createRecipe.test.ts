import { Recipe } from '../../../models/recipeModel';
import RecipeService from '../../../services/recipeService';

import { mockBody, mockId, mockImage, mockTitle } from '../../mocks/mockRecipe';

import { setupTests } from '../../setupTests';

const recipeService = new RecipeService();

setupTests('createRecipe', () => {
  test('should save new Recipe in a database', async () => {
    const newRecipe = await recipeService.createRecipe(mockId, mockTitle, mockImage, mockBody);
    const recipe = await Recipe.findById(newRecipe.id);
    expect(recipe).toBeDefined();
    expect(recipe?.title).toBe(mockTitle);
    expect(recipe?.body).toBe(mockBody);
    expect(recipe?.ownerId).toBe(mockId);
    expect(recipe?.imageUrl).toBe(mockImage);
  });

  describe('should throw when', () => {
    test('no title provided', async () => {
      await expect(recipeService.createRecipe(mockId, '', mockImage, mockBody)).rejects.toThrowError(
        '`title` is required',
      );
    });

    test('no body provided', async () => {
      await expect(recipeService.createRecipe(mockId, mockTitle, mockImage, '')).rejects.toThrow('`body` is required');
    });
  });

  test('should run Recipe.save()', async () => {
    const spyRecipe = jest.spyOn(Recipe.prototype, 'save');
    await recipeService.createRecipe(mockId, mockTitle, mockImage, mockBody);
    expect(spyRecipe).toBeCalledTimes(1);
  });
});
