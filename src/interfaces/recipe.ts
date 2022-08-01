export interface IRecipe {
  _id: string;
  ownerId: string;
  title: string;
  imageUrl: string;
  body: string;
  createdAt: Date;
}

export type RecipePayload = Omit<IRecipe, '_id'>;
