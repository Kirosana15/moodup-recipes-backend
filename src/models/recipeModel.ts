import { Schema, Types, model } from 'mongoose';

interface IRecipe {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  title: string;
  body: string;
  createdAt: Date;
}

const recipeSchema = new Schema<IRecipe>({
  ownerId: {
    type: Schema.Types.ObjectId,
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
