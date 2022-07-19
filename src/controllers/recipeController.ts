import RecipeService from '../services/recipeService';

const recipeService = new RecipeService();

// RecipeController class for recipe related requests
class RecipeController {
  // Returns a list of all recipes
  public async getAllRecipes(req: any, res: any) {
    try {
      const recipes = await recipeService.getAllRecipes(
        req.query.page,
        req.query.limit
      );
      res.status(200).send(recipes);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
  // Returns a recipe with provided id
  public async getRecipe(req: any, res: any) {
    try {
      const recipe = await recipeService.getRecipe(req.params.id);
      if (recipe) {
        res.status(200).send(recipe);
      } else {
        res.status(404).send('Recipe not found');
      }
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
  // Returns a list of all recipes for logged in user
  public async getRecipesByOwner(req: any, res: any) {
    try {
      const recipes = await recipeService.getRecipesByOwner(
        req.user.id,
        req.query.page,
        req.query.limit
      );
      res.status(200).send(recipes);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
  // Creates a new recipe
  public async createRecipe(req: any, res: any) {
    try {
      const recipe = await recipeService.createRecipe(
        req.user.id,
        req.body.title,
        req.body.body
      );
      res.status(201).send(recipe);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
  // Updates body of a recipe with provided id if the user is the owner or an admin
  public async updateRecipe(req: any, res: any) {
    try {
      const recipe = await recipeService.updateRecipe(
        req.params.id,
        req.body.body
      );
      if (recipe) {
        if (recipe.ownerId.toString() === req.user.id || req.user.isAdmin) {
          res.status(200).send(recipe);
        } else {
          res.status(403).send('Unauthorized');
        }
      } else {
        res.status(404).send('Recipe not found');
      }
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
  // Deletes a recipe with provided id if the user is the owner or an admin
  public async removeRecipe(req: any, res: any) {
    try {
      const recipe = await recipeService.getRecipe(req.params.id);
      if (recipe) {
        if (recipe.ownerId.toString() === req.user.id || req.user.isAdmin) {
          try {
            const removed = await recipeService.removeRecipe(req.params.id);
            res.status(200).send(removed);
          } catch (err) {
            console.log(err);
            res.status(400);
          }
        } else {
          res.status(403).send('Unauthorized');
        }
      } else {
        res.status(404).send('Recipe not found');
      }
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
  // Returns a list of recipes satisfying the search query in the title
  public async searchRecipes(req: any, res: any) {
    try {
      const recipes = await recipeService.getRecipesByTitle(
        req.params.query,
        req.query.page,
        req.query.limit
      );
      res.status(200).send(recipes);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
}

export default RecipeController;
