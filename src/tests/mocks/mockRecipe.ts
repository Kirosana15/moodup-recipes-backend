import { faker } from '@faker-js/faker';
import { RecipePayload, IRecipe } from '../../interfaces/recipe';
import { Recipe } from '../../models/recipeModel';

export const mockId = faker.database.mongodbObjectId();
export const mockTitle = `${faker.word.adverb()} ${faker.word.adjective()} ${faker.word.noun()}`;
export const mockImage = faker.image.food();
export const mockBody = faker.commerce.productDescription();
export const mockDate = faker.date.past();

export const generateRecipe = (): RecipePayload => {
  return {
    ownerId: faker.database.mongodbObjectId(),
    title: `${faker.word.adverb()} ${faker.word.adjective()} ${faker.word.noun()}`,
    imageUrl: faker.image.food(),
    body: faker.commerce.productDescription(),
    createdAt: faker.date.past(),
  };
};

export const generateRecipes = (n: number): RecipePayload[] => {
  return Array.from(Array(n), generateRecipe);
};

export const saveRecipe = async (): Promise<IRecipe> => {
  return <IRecipe>await new Recipe(generateRecipe()).save();
};

export const saveRecipes = async (n: number): Promise<IRecipe[]> => {
  return <IRecipe[]>await Recipe.insertMany(generateRecipes(n));
};
