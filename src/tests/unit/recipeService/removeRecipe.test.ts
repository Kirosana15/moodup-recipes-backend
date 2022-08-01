import { mockId, saveRecipe, saveRecipes } from '../../mocks/mockRecipe';
import RecipeService from '../../../services/recipeService';
import { Recipe } from '../../../models/recipeModel';
import { setupTests } from '../../setupTests';

const recipeService = new RecipeService();

setupTests('removeRecipe', () => {
  test('returns removed recipe', async () => {
    const newRecipe = await saveRecipe();
    const recipe = await recipeService.removeRecipe(newRecipe._id);
    expect(recipe).toBeDefined();
    expect(recipe?.title).toBe(newRecipe.title);
    expect(recipe?.imageUrl).toBe(newRecipe.imageUrl);
    expect(recipe?.body).toBe(newRecipe.body);
  });
  test('removes recipe from database', async () => {
    const newRecipe = await saveRecipe();
    await recipeService.removeRecipe(newRecipe._id);
    expect(await Recipe.findById(newRecipe._id).exec()).toBeNull();
    expect(await Recipe.countDocuments({})).toBe(0);
  });
  test("doesn't return recipe if id doesn't exist", async () => {
    const recipe = await recipeService.removeRecipe(mockId);
    expect(recipe).toBeNull();
  });
  test("throws and doesn't remove any recipes if id is not provided", async () => {
    saveRecipes(2);
    await expect(recipeService.removeRecipe('')).rejects.toThrow();
    expect(await Recipe.countDocuments({})).toBe(2);
  });
});
