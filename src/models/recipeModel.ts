import { Schema, model } from 'mongoose';
import { IRecipe } from '../interfaces/recipe';

const recipeSchema = new Schema<IRecipe>({
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

export const Recipe = model<IRecipe>('Recipe', recipeSchema);
