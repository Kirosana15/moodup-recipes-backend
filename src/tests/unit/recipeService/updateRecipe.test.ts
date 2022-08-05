import {
  mockBody,
  mockId,
  mockImage,
  mockTitle,
  saveRecipe,
} from '../../mocks/mockRecipe';
import RecipeService from '../../../services/recipeService';
import { Recipe } from '../../../models/recipeModel';
import { setupTests } from '../../setupTests';

const recipeService = new RecipeService();

setupTests('updateRecipe', () => {
  test('should return the updated recipe', async () => {
    const newRecipe = await saveRecipe();
    const recipe = await recipeService.updateRecipe(
      newRecipe._id,
      mockTitle,
      mockImage,
      mockBody
    );
    expect(recipe?.title).toBe(mockTitle);
    expect(recipe?.imageUrl).toBe(mockImage);
    expect(recipe?.body).toBe(mockBody);
  });

  test('should change recipe in a database', async () => {
    const newRecipe = await saveRecipe();
    await recipeService.updateRecipe(
      newRecipe._id,
      mockTitle,
      mockImage,
      mockBody
    );
    const recipe = await Recipe.findById(newRecipe._id);
    expect(recipe?.title).toBe(mockTitle);
    expect(recipe?.imageUrl).toBe(mockImage);
    expect(recipe?.body).toBe(mockBody);
  });

  test('should not return a recipe if id does not exist', async () => {
    const recipe = await recipeService.updateRecipe(
      mockId,
      mockTitle,
      mockImage,
      mockBody
    );
    expect(recipe).toBeNull();
  });
});
