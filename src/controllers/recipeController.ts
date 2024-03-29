import { matchedData } from 'express-validator';
import recipeService from '../services/recipeService';
import Express from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import {
  CreateRecipeDto,
  GetAllRecipesDto,
  UpdateRecipeDto,
  GetRecipeDto,
  GetRecipesByOwnerDto,
  RemoveRecipeDto,
  SearchRecipesDto,
} from '../interfaces/dto/recipeDtos';
import { IUser } from '../interfaces/user';
export class RecipeController {
  // Returns a list of all recipes
  public async getAllRecipes(req: Express.Request, res: Express.Response) {
    const { page, limit } = <GetAllRecipesDto>matchedData(req);
    try {
      const recipes = await recipeService.getAllRecipes(page, limit);
      res.status(StatusCodes.OK).send(recipes);
    } catch (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }
  // Returns a recipe with provided id
  public async getRecipe(req: Express.Request, res: Express.Response) {
    const { id } = <GetRecipeDto>matchedData(req);
    try {
      const recipe = await recipeService.getRecipe(id);
      if (recipe) {
        res.status(StatusCodes.OK).send(recipe);
      } else {
        res.status(StatusCodes.NOT_FOUND).send('Recipe not found');
      }
    } catch (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }
  // Returns a list of all recipes for logged in user
  public async getRecipesByOwner(req: Express.Request, res: Express.Response) {
    const { page, limit } = <GetRecipesByOwnerDto>matchedData(req);
    const user = <IUser>req.user;
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
    try {
      const recipes = await recipeService.getRecipesByOwner(user.id, page, limit);
      res.status(StatusCodes.OK).send(recipes);
    } catch (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }
  // Creates a new recipe
  public async createRecipe(req: Express.Request, res: Express.Response) {
    const { title, imageUrl, body } = <CreateRecipeDto>matchedData(req);
    const user = <IUser>req.user;
    try {
      const recipe = await recipeService.createRecipe(user.id, title, imageUrl, body);
      res.status(201).send(recipe);
    } catch (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }
  // Updates body of a recipe with provided id if the user is the owner or an admin
  public async updateRecipe(req: Express.Request, res: Express.Response) {
    const { id, title, imageUrl, body } = <UpdateRecipeDto>matchedData(req);
    const user = <IUser>req.user;
    try {
      const recipe = await recipeService.getRecipe(id);
      if (recipe) {
        if (recipe.ownerId.toString() === user.id || user.isAdmin) {
          const newRecipe = await recipeService.updateRecipe(id, title, imageUrl, body);
          return res.send(newRecipe);
        } else {
          return res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
        }
      } else {
        return res.status(StatusCodes.NOT_FOUND).send('Recipe not found');
      }
    } catch (err) {
      console.log(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }
  // Deletes a recipe with provided id if the user is the owner or an admin
  public async removeRecipe(req: Express.Request, res: Express.Response) {
    const { id } = <RemoveRecipeDto>matchedData(req);
    const user = <IUser>req.user;
    try {
      const recipe = await recipeService.getRecipe(id);
      if (recipe) {
        if (recipe.ownerId.toString() === user.id || user.isAdmin) {
          try {
            const removed = await recipeService.removeRecipe(id);
            res.status(StatusCodes.OK).send(removed);
          } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
          }
        } else {
          res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
        }
      } else {
        res.status(StatusCodes.NOT_FOUND).send('Recipe not found');
      }
    } catch (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }
  // Returns a list of recipes satisfying the search query in the title
  public async searchRecipes(req: Express.Request, res: Express.Response) {
    const { query, page, limit } = <SearchRecipesDto>matchedData(req);
    try {
      const recipes = await recipeService.getRecipesByTitle(query, page, limit);
      res.status(StatusCodes.OK).send(recipes);
    } catch (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  }
}

export default new RecipeController();
