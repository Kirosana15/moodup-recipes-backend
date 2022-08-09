import { mockId, generateRecipe, generateRecipes } from './mockRecipe';

export const mockCreateRecipe = jest.fn().mockResolvedValue(generateRecipe());

export const mockGetRecipe = jest.fn().mockImplementation((id = mockId) => Promise.resolve(generateRecipe(id)));

export const mockGetAllRecipes = jest.fn().mockImplementation((limit = 10) => Promise.resolve(generateRecipes(limit)));

export const mockGetRecipesByOwner = jest
  .fn()
  .mockImplementation((limit = 10) => Promise.resolve(generateRecipes(limit)));

export const mockUpdateRecipe = jest
  .fn()
  .mockImplementation((id, title?, imageUrl?, body?) =>
    Promise.resolve({ id, ...generateRecipe(undefined, title, imageUrl, body) }),
  );
export const mockRemoveRecipe = jest.fn().mockResolvedValue(generateRecipe());

export const mockGetRecipesByTitle = jest
  .fn()
  .mockImplementation((limit = 10) => Promise.resolve(generateRecipes(limit)));
