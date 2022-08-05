import { matchedData } from 'express-validator';
import RecipeService from '../services/recipeService';
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
import { User } from '../models/userModel';

const recipeService = new RecipeService();

// RecipeController class for recipe related requests
export class RecipeController {
  // Returns a list of all recipes
  public async getAllRecipes(req: Express.Request, res: Express.Response) {
    const { page, limit } = <GetAllRecipesDto>matchedData(req);

    const recipes = await recipeService.getAllRecipes(page, limit);
    res.status(StatusCodes.OK).send(recipes);
  }
  // Returns a recipe with provided id
  public async getRecipe(req: Express.Request, res: Express.Response) {
    const { id } = <GetRecipeDto>matchedData(req);
    const recipe = await recipeService.getRecipe(id);
    if (recipe) {
      res.status(StatusCodes.OK).send(recipe);
    } else {
      res.status(StatusCodes.NOT_FOUND).send('Recipe not found');
    }
  }
  // Returns a list of all recipes for logged in user
  public async getRecipesByOwner(req: Express.Request, res: Express.Response) {
    const { page, limit } = <GetRecipesByOwnerDto>matchedData(req);
    const user = <User>req.user;
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
    const recipes = await recipeService.getRecipesByOwner(user._id, page, limit);
    res.status(StatusCodes.OK).send(recipes);
  }
  // Creates a new recipe
  public async createRecipe(req: Express.Request, res: Express.Response) {
    const { title, imageUrl, body } = <CreateRecipeDto>matchedData(req);
    const user = <User>req.user;
    const recipe = await recipeService.createRecipe(user._id, title, imageUrl, body);
    res.status(201).send(recipe);
  }
  // Updates body of a recipe with provided id if the user is the owner or an admin
  public async updateRecipe(req: Express.Request, res: Express.Response) {
    const { id, title, imageUrl, body } = <UpdateRecipeDto>matchedData(req);
    const user = <User>req.user;
    const recipe = await recipeService.updateRecipe(id, title, imageUrl, body);
    if (recipe) {
      if (recipe.ownerId.toString() === user._id || user.isAdmin) {
        const newRecipe = await recipeService.updateRecipe(id, title, imageUrl, body);
        res.send(newRecipe);
      } else {
        res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
      }
    } else {
      res.status(StatusCodes.NOT_FOUND).send('Recipe not found');
    }
  }
  // Deletes a recipe with provided id if the user is the owner or an admin
  public async removeRecipe(req: Express.Request, res: Express.Response) {
    const { id } = <RemoveRecipeDto>matchedData(req);
    const user = <User>req.user;
    const recipe = await recipeService.getRecipe(id);
    if (recipe) {
      if (recipe.ownerId.toString() === user._id || user.isAdmin) {
        const removed = await recipeService.removeRecipe(id);
        res.status(StatusCodes.OK).send(removed);
      } else {
        res.status(StatusCodes.FORBIDDEN).send(ReasonPhrases.FORBIDDEN);
      }
    } else {
      res.status(StatusCodes.NOT_FOUND).send('Recipe not found');
    }
  }
  // Returns a list of recipes satisfying the search query in the title
  public async searchRecipes(req: Express.Request, res: Express.Response) {
    const { query, page, limit } = <SearchRecipesDto>matchedData(req);

    const recipes = await recipeService.getRecipesByTitle(query, page, limit);
    res.status(StatusCodes.OK).send(recipes);
  }
}

export default new RecipeController();
