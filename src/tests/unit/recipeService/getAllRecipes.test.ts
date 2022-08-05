import { saveRecipes } from '../../mocks/mockRecipe';
import RecipeService from '../../../services/recipeService';
import { setupTests } from '../../setupTests';

const recipeService = new RecipeService();

setupTests('getAllRecipes', () => {
  describe('should return', () => {
    test('existing recipes', async () => {
      await saveRecipes(3);
      const recipes = await recipeService.getAllRecipes();
      expect(recipes).toHaveLength(3);
    });

    test('empty array if no recipes are present', async () => {
      const recipes = await recipeService.getAllRecipes();
      expect(recipes).toEqual([]);
    });

    test('paginated results', async () => {
      await saveRecipes(20);
      let recipes = await recipeService.getAllRecipes();
      expect(recipes).toHaveLength(10);
      recipes = await recipeService.getAllRecipes(undefined, 20);
      expect(recipes).toHaveLength(20);
      const [firstRecipe] = await recipeService.getAllRecipes(2, 5);
      expect(firstRecipe).toEqual(recipes[5]);
    });

    test('results sorted by descending creation time', async () => {
      await saveRecipes(5);
      const recipes = await recipeService.getAllRecipes();
      expect(recipes).toStrictEqual(
        [...recipes].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
      );
    });
  });
});
