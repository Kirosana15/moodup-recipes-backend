import { saveRecipes } from '../../mocks/mockRecipe';
import RecipeService from '../../../services/recipeService';
import { setupTests } from '../../setupTests';

const recipeService = new RecipeService();

setupTests('getAllRecipes', () => {
  test('returns existing recipes', async () => {
    await saveRecipes(3);
    const recipes = await recipeService.getAllRecipes();
    expect(recipes).toHaveLength(3);
  });

  test('returns empty array if no recipes present', async () => {
    const recipes = await recipeService.getAllRecipes();
    expect(recipes).toEqual([]);
  });

  test('return paginated results', async () => {
    await saveRecipes(20);
    let recipes = await recipeService.getAllRecipes();
    expect(recipes).toHaveLength(10);
    recipes = await recipeService.getAllRecipes(undefined, 20);
    expect(recipes).toHaveLength(20);
    const pagedRecipes = await recipeService.getAllRecipes(2, 5);
    expect(pagedRecipes[0]).toEqual(recipes[5]);
  });

  test('results are sorted by descending creation time', async () => {
    await saveRecipes(5);
    const recipes = await recipeService.getAllRecipes();
    expect(recipes[0].createdAt.getTime()).toBeGreaterThan(
      recipes[1].createdAt.getTime()
    );
  });
});
