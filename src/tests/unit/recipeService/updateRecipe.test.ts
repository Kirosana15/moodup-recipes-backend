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
  test('returns the updated recipe', async () => {
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

  test('changes recipe in a database', async () => {
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

  test("doesn't return the recipe if id doesn't exist", async () => {
    const recipe = await recipeService.updateRecipe(
      mockId,
      mockTitle,
      mockImage,
      mockBody
    );
    expect(recipe).toBeNull();
  });
});
