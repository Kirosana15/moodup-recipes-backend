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
  test('should fetch recipes from database', async () => {
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

  test('should find recipes with titles containing a query', async () => {
    const recipe = await saveRecipe();
    const partTitle = recipe.title.split(' ')[2];
    const foundRecipes = await recipeService.getRecipesByTitle(partTitle);
    expect(foundRecipes[0]._id).toStrictEqual(recipe._id);
  });

  describe('should not return recipe when', () => {
    test('query does not match any existing title', async () => {
      expect(await recipeService.getRecipesByTitle(mockTitle)).toHaveLength(0);
    });

    test('no title provided', async () => {
      const title = '';
      expect(await recipeService.getRecipesByTitle(title)).toHaveLength(0);
    });
  });
});
