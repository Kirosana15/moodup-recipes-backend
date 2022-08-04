import { Schema, model } from 'mongoose';
import { Recipe as RecipeType } from '../interfaces/recipe';

const recipeSchema = new Schema<RecipeType>({
  ownerId: {
    type: String,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: 'https://placekitten.com/150/150',
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

recipeSchema.index({ title: 'text' });

export const Recipe = model<RecipeType>('Recipe', recipeSchema);
