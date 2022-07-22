import { matchedData } from 'express-validator';
import RecipeService from '../services/recipeService';
import Express from 'express';
import { TypedRequest } from '../interfaces/typedRequest';

const recipeService = new RecipeService();

// RecipeController class for recipe related requests
export class RecipeController {
  // Returns a list of all recipes
  public async getAllRecipes(req: TypedRequest, res: Express.Response) {
    const { page, limit } = matchedData(req);
    try {
      const recipes = await recipeService.getAllRecipes(page, limit);
      res.status(200).send(recipes);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
  // Returns a recipe with provided id
  public async getRecipe(req: TypedRequest, res: Express.Response) {
    const { id } = matchedData(req);
    try {
      const recipe = await recipeService.getRecipe(id);
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
  public async getRecipesByOwner(req: TypedRequest, res: Express.Response) {
    const { id, page, limit } = matchedData(req);
    try {
      const recipes = await recipeService.getRecipesByOwner(id, page, limit);
      res.status(200).send(recipes);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
  // Creates a new recipe
  public async createRecipe(req: TypedRequest, res: Express.Response) {
    const { id, title, body } = matchedData(req);
    try {
      const recipe = await recipeService.createRecipe(id, title, body);
      res.status(201).send(recipe);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
  // Updates body of a recipe with provided id if the user is the owner or an admin
  public async updateRecipe(req: TypedRequest, res: Express.Response) {
    const { id, body } = matchedData(req);
    try {
      const recipe = await recipeService.updateRecipe(id, body);
      if (recipe) {
        if (
          recipe.ownerId.toString() === req.body.user.id ||
          req.body.user.isAdmin
        ) {
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
  public async removeRecipe(req: TypedRequest, res: Express.Response) {
    const { id } = matchedData(req);
    try {
      const recipe = await recipeService.getRecipe(id);
      if (recipe) {
        if (
          recipe.ownerId.toString() === req.body.user.id ||
          req.body.user.isAdmin
        ) {
          try {
            const removed = await recipeService.removeRecipe(id);
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
  public async searchRecipes(req: TypedRequest, res: Express.Response) {
    const { query, page, limit } = matchedData(req);
    try {
      const recipes = await recipeService.getRecipesByTitle(query, page, limit);
      res.status(200).send(recipes);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
}

export default RecipeController;
