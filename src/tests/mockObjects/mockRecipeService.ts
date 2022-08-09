import { generateRecipe, generateRecipes } from './mockRecipe';

export const mockCreateRecipe = jest.fn().mockResolvedValue(generateRecipe());

export const mockGetRecipe = jest.fn().mockResolvedValue(generateRecipe());

export const mockGetAllRecipes = jest.fn().mockImplementation((limit = 10) => Promise.resolve(generateRecipes(limit)));

export const mockGetRecipesByOwner = jest
  .fn()
  .mockImplementation((limit = 10) => Promise.resolve(generateRecipes(limit)));

export const mockUpdateRecipe = jest.fn().mockResolvedValue(generateRecipe());

export const mockRemoveRecipe = jest.fn().mockResolvedValue(generateRecipe());

export const mockGetRecipesByTitle = jest
  .fn()
  .mockImplementation((limit = 10) => Promise.resolve(generateRecipes(limit)));
