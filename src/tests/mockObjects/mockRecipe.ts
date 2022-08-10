import { faker } from '@faker-js/faker';
import { RecipePayload, IRecipe } from '../../interfaces/recipe';
import { Recipe } from '../../models/recipeModel';

export const mockId = faker.database.mongodbObjectId();
export const mockTitle = `${faker.word.adverb()} ${faker.word.adjective()} ${faker.word.noun()}`.slice(0, 20);
export const mockImage = faker.image.food();
export const mockBody = faker.commerce.productDescription();
export const mockDate = faker.date.past();
export const mockQuery = faker.word.noun();

export const createRecipe = (title?: string, imageUrl?: string, body?: string) => {
  return {
    title: title || mockTitle,
    imageUrl: imageUrl || mockImage,
    body: body || mockBody,
  };
};

export const generateRecipe = (
  ownerId?: string,
  title?: string,
  imageUrl?: string,
  body?: string,
  createdAt?: Date,
): RecipePayload => {
  return {
    ownerId: ownerId || mockId,
    title: title || mockTitle,
    imageUrl: imageUrl || mockImage,
    body: body || mockBody,
    createdAt: createdAt || mockDate,
  };
};

export const generateRecipes = (count: number): RecipePayload[] => {
  return Array.from(Array(count), () => generateRecipe());
};

export const saveRecipe = async (): Promise<IRecipe> => {
  return <IRecipe>await new Recipe(generateRecipe()).save();
};

export const saveRecipes = async (n: number): Promise<IRecipe[]> => {
  return <IRecipe[]>await Recipe.insertMany(generateRecipes(n));
};
