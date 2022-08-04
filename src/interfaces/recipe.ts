export interface Recipe {
  _id: string;
  ownerId: string;
  title: string;
  imageUrl: string;
  body: string;
  createdAt: Date;
}

export type RecipePayload = Omit<Recipe, '_id'>;
