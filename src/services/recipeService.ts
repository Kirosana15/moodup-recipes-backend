//Service for database operations on the "recipes" collection

import { Recipe } from "../models/recipeModel";

class RecipeService {
  public async createRecipe(ownerId: string, title: string, body: string) {
    const recipe = new Recipe({ ownerId, title, body });
    return recipe.save();
  }
  public async getRecipe(id: string) {
    return await Recipe.findById(id, "_id ownerId title body created");
  }
  public async getAllRecipes(page = 1, limit = 10) {
    return await Recipe.find({}, "_id ownerId title body created")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created: -1 })
      .exec();
  }
  public async getRecipesByOwner(ownerId: string, page = 1, limit = 10) {
    return await Recipe.find(
      { ownerId: ownerId },
      "_id ownerId title body created"
    )
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created: -1 })
      .exec();
  }
  public async updateRecipe(id: string, body: string) {
    return await Recipe.findByIdAndUpdate(id, { body });
  }
  public async removeRecipe(id: string) {
    return await Recipe.findByIdAndRemove(id);
  }
  // case insensitive partial text search on title
  public async getRecipesByTitle(title: string, page = 1, limit = 10) {
    return await Recipe.find(
      { title: { $regex: title, $options: "i" } },
      "_id ownerId title body created"
    )
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created: -1 })
      .exec();
  }
}

export default RecipeService;
