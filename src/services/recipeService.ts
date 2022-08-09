//Service for database operations on the "recipes" collection

import { Recipe } from '../models/recipeModel';

class RecipeService {
  public createRecipe(
    ownerId: string,
    title: string,
    imageUrl: string,
    body: string
  ) {
    const recipe = new Recipe({ ownerId, title, imageUrl, body });
    return recipe.save();
  }
  public getRecipe(id: string) {
    return Recipe.findById(
      id,
      '_id ownerId title imageUrl body createdAt'
    ).exec();
  }
  public getAllRecipes(page = 1, limit = 10) {
    return Recipe.find({}, '_id ownerId title imageUrl body createdAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }
  public getRecipesByOwner(ownerId: string | undefined, page = 1, limit = 10) {
    return Recipe.find(
      { ownerId: ownerId },
      '_id ownerId title imageUrl body createdAt'
    )
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }
  public updateRecipe(
    id: string,
    title: string,
    imageUrl: string,
    body: string
  ) {
    return Recipe.findByIdAndUpdate(
      id,
      {
        title: title,
        imageUrl: imageUrl,
        body: body,
      },
      { new: true }
    ).exec();
  }
  public removeRecipe(id: string) {
    return Recipe.findByIdAndRemove(id).exec();
  }
  // case insensitive partial text search on title
  public getRecipesByTitle(title: string, page = 1, limit = 10) {
    return Recipe.find(
      { title: { $regex: title, $options: 'i' } },
      '_id ownerId title imageUrl body createdAt'
    )
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }
}

export default new RecipeService();
