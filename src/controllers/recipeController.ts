import RecipeService from '../services/recipeService';
import Express from 'express';
import { Query } from 'express-serve-static-core';

const recipeService = new RecipeService();

interface TypedRequest<T extends Query, U, V> extends Express.Request {
  query: T;
  body: U;
  user: V;
}

// RecipeController class for recipe related requests
class RecipeController {
  // Returns a list of all recipes
  public async getAllRecipes(
    req: TypedRequest<{ page: string; limit: string }, unknown, unknown>,
    res: Express.Response
  ) {
    try {
      const recipes = await recipeService.getAllRecipes(
        parseInt(req.query.page),
        parseInt(req.query.limit)
      );
      res.status(200).send(recipes);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
  // Returns a recipe with provided id
  public async getRecipe(req: Express.Request, res: Express.Response) {
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
  public async getRecipesByOwner(
    req: TypedRequest<{ page: string; limit: string }, unknown, { id: string }>,
    res: Express.Response
  ) {
    try {
      const recipes = await recipeService.getRecipesByOwner(
        req.user.id,
        parseInt(req.query.page),
        parseInt(req.query.limit)
      );
      res.status(200).send(recipes);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
  // Creates a new recipe
  public async createRecipe(
    req: TypedRequest<
      { page: string },
      { title: string; body: string },
      { id: string }
    >,
    res: Express.Response
  ) {
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
  public async updateRecipe(
    req: TypedRequest<
      { page: string },
      { body: string },
      { id: string; isAdmin: boolean }
    >,
    res: Express.Response
  ) {
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
  public async removeRecipe(
    req: TypedRequest<
      { page: string },
      unknown,
      { id: string; isAdmin: boolean }
    >,
    res: Express.Response
  ) {
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
  public async searchRecipes(
    req: TypedRequest<{ page: string; limit: string }, unknown, unknown>,
    res: Express.Response
  ) {
    try {
      const recipes = await recipeService.getRecipesByTitle(
        req.params.query,
        parseInt(req.query.page),
        parseInt(req.query.limit)
      );
      res.status(200).send(recipes);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  }
}

export default RecipeController;
