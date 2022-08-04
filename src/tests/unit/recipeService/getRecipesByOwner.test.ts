import { mockId, saveRecipes } from '../../mocks/mockRecipe';
import RecipeService from '../../../services/recipeService';
import { setupTests } from '../../setupTests';

const recipeService = new RecipeService();

setupTests('getRecipesByOwner', () => {
  describe('should return', () => {
    test('existing recipes', async () => {
      await saveRecipes(3, mockId);
      const recipes = await recipeService.getRecipesByOwner(mockId);
      expect(recipes).toHaveLength(3);
    });

    test('empty array if no recipes present', async () => {
      const recipes = await recipeService.getRecipesByOwner(mockId);
      expect(recipes).toEqual([]);
    });

    test('paginated results', async () => {
      await saveRecipes(20, mockId);
      let recipes = await recipeService.getRecipesByOwner(mockId);
      expect(recipes).toHaveLength(10);
      recipes = await recipeService.getRecipesByOwner(mockId, undefined, 20);
      expect(recipes).toHaveLength(20);
      const pagedRecipes = await recipeService.getRecipesByOwner(mockId, 2, 5);
      expect(pagedRecipes[0]).toEqual(recipes[5]);
    });

    test('results sorted by descending creation time', async () => {
      await saveRecipes(5, mockId);
      const recipes = await recipeService.getRecipesByOwner(mockId);
      expect(recipes).toStrictEqual(
        [...recipes].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
      );
    });

    test('only recipes owned by user', async () => {
      await saveRecipes(5, mockId);
      await saveRecipes(5);
      const recipes = await recipeService.getRecipesByOwner(mockId);
      expect(recipes).toHaveLength(5);
      expect(recipes[0].ownerId).toBe(mockId);
    });

    test('empty array if not provided with ownerId', async () => {
      await saveRecipes(5);
      const recipes = await recipeService.getRecipesByOwner('');
      await expect(recipes).toHaveLength(0);
    });
  });
});
