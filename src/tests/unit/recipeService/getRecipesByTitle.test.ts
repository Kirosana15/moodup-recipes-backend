import RecipeService from '../../../services/recipeService';
import { Recipe } from '../../../models/recipeModel';
import {
  mockTitle,
  mockBody,
  mockImage,
  saveRecipe,
  mockId,
} from '../../mocks/mockRecipe';
import { setupTests } from '../../setupTests';

const recipeService = new RecipeService();

setupTests('getRecipesByTitle', () => {
  test('fetch a recipe from a database', async () => {
    await new Recipe({
      ownerId: mockId,
      title: mockTitle,
      imageUrl: mockImage,
      body: mockBody,
    }).save();
    const recipes = await recipeService.getRecipesByTitle(mockTitle);
    expect(recipes[0]).toBeDefined();
    expect(recipes[0].title).toBe(mockTitle);
    expect(recipes[0].imageUrl).toBe(mockImage);
    expect(recipes[0].body).toBe(mockBody);
  });

  describe('no recipe returned when', () => {
    test("title doesn't exists", async () => {
      expect(await recipeService.getRecipesByTitle(mockTitle)).toHaveLength(0);
    });

    test('no title provided', async () => {
      const title = '';
      expect(await recipeService.getRecipesByTitle(title)).toHaveLength(0);
    });
    test('finds recipe with a title containing a query string', async () => {
      const recipe = await saveRecipe();
      const partTitle = recipe.title.split(' ')[2];
      const foundRecipes = await recipeService.getRecipesByTitle(partTitle);
      expect(foundRecipes[0]._id).toStrictEqual(recipe._id);
    });
  });
});
