import { faker } from '@faker-js/faker';
import { RecipePayload, Recipe as RecipeType } from '../../interfaces/recipe';
import { Recipe } from '../../models/recipeModel';

export const mockId = faker.database.mongodbObjectId();
export const mockTitle = `${faker.word.adverb()} ${faker.word.adjective()} ${faker.word.noun()}`;
export const mockImage = faker.image.food();
export const mockBody = faker.commerce.productDescription();
export const mockDate = faker.date.past();

export const generateRecipe = (ownerId?: string): RecipePayload => {
  return {
    ownerId: ownerId || faker.database.mongodbObjectId(),
    title: `${faker.word.adverb()} ${faker.word.adjective()} ${faker.word.noun()}`,
    imageUrl: faker.image.food(),
    body: faker.commerce.productDescription(),
    createdAt: faker.date.past(),
  };
};

export const generateRecipes = (
  n: number,
  ownerId?: string
): RecipePayload[] => {
  return Array.from(Array(n), () => {
    return generateRecipe(ownerId);
  });
};

export const saveRecipe = async (ownerId?: string): Promise<RecipeType> => {
  return <RecipeType>await new Recipe(generateRecipe(ownerId)).save();
};

export const saveRecipes = async (
  n: number,
  ownerId?: string
): Promise<RecipeType[]> => {
  return <RecipeType[]>await Recipe.insertMany(generateRecipes(n, ownerId));
};
