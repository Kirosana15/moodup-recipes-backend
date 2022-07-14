//Service for database operations on the "recipes" collection

import mongoose from 'mongoose';
import { IRecipe } from '../models/recipeModel';
const Recipe = mongoose.model<IRecipe>('Recipe');

class RecipeService {
  public createRecipe(ownerId: string, title: string, body: string) {
    const recipe = new Recipe({ ownerId, title, body });
    return recipe.save();
  }
  public getRecipe(id: string) {
    return Recipe.findById(id, '_id ownerId title body created').exec();
  }
  public getAllRecipes(page = 1, limit = 10) {
    return Recipe.find({}, '_id ownerId title body created')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created: -1 })
      .exec();
  }
  public getRecipesByOwner(ownerId: string, page = 1, limit = 10) {
    return Recipe.find({ ownerId: ownerId }, '_id ownerId title body created')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created: -1 })
      .exec();
  }
  public updateRecipe(id: string, body: string) {
    return Recipe.findByIdAndUpdate(id, { body }).exec();
  }
  public removeRecipe(id: string) {
    return Recipe.findByIdAndRemove(id).exec();
  }
  // case insensitive partial text search on title
  public getRecipesByTitle(title: string, page = 1, limit = 10) {
    return Recipe.find(
      { title: { $regex: title, $options: 'i' } },
      '_id ownerId title body created'
    )
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created: -1 })
      .exec();
  }
}

export default RecipeService;
