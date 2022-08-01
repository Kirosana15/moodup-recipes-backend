import { mockId, saveRecipes } from '../../mocks/mockRecipe';
import RecipeService from '../../../services/recipeService';
import { setupTests } from '../../setupTests';

const recipeService = new RecipeService();

setupTests('getRecipesByOwner', () => {
  test('returns existing recipes', async () => {
    await saveRecipes(3, mockId);
    const recipes = await recipeService.getRecipesByOwner(mockId);
    expect(recipes).toHaveLength(3);
  });

  test('returns empty array if no recipes present', async () => {
    const recipes = await recipeService.getRecipesByOwner(mockId);
    expect(recipes).toEqual([]);
  });

  test('return paginated results', async () => {
    await saveRecipes(20, mockId);
    let recipes = await recipeService.getRecipesByOwner(mockId);
    expect(recipes).toHaveLength(10);
    recipes = await recipeService.getRecipesByOwner(mockId, undefined, 20);
    expect(recipes).toHaveLength(20);
    const pagedRecipes = await recipeService.getRecipesByOwner(mockId, 2, 5);
    expect(pagedRecipes[0]).toEqual(recipes[5]);
  });

  test('results are sorted by descending creation time', async () => {
    await saveRecipes(5, mockId);
    const recipes = await recipeService.getRecipesByOwner(mockId);
    expect(recipes[0].createdAt.getTime()).toBeGreaterThan(
      recipes[1].createdAt.getTime()
    );
  });
  test("doesn't return recipes not owned by user", async () => {
    await saveRecipes(5, mockId);
    await saveRecipes(5);
    const recipes = await recipeService.getRecipesByOwner(mockId);
    expect(recipes).toHaveLength(5);
    expect(recipes[0].ownerId).toBe(mockId);
  });
  test('returns empty array if not provided with ownerId', async () => {
    await saveRecipes(5);
    const recipes = await recipeService.getRecipesByOwner('');
    await expect(recipes).toHaveLength(0);
  });
});
