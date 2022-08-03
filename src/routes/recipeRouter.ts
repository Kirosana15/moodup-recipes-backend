//Router for recipe endpoints

import express from 'express';
import AuthController from '../controllers/authController';
import { RecipeController } from '../controllers/recipeController';
import { validate } from '../validators/validators';
import {
  validateGetRecipes,
  validateGetAllRecipes,
  validateGetRecipe,
  validateCreateRecipe,
  validateUpdateRecipe,
  validateRemoveRecipe,
  validateSearchRecipes,
} from '../validators/recipeValidators';
import { authService } from '../services/authService';
import { Strategy } from '../interfaces/strategy';

const router = express.Router();

const recipeController = new RecipeController();
const authController = new AuthController();

/**
 * @swagger
 * /recipes:
 *   get:
 *     tags:
 *       - Recipes
 *     description: Fetches recipes for logged in user
 *     produces:
 *       - application/json
 *     security:
 *       - JWT: []
 *     parameters:
 *       - name: page
 *         description: Page number
 *         in: query
 *       - name: limit
 *         description: Number of recipes per page
 *         in: query
 *     responses:
 *       200:
 *         description: Returns a recipe list
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Recipe'
 */
router.get(
  '/recipes',
  authService.authenticate(Strategy.Bearer),
  validate(validateGetRecipes),
  recipeController.getRecipesByOwner,
);

/**
 * @swagger
 * /recipes:
 *   post:
 *     tags:
 *       - Recipes
 *     description: Creates a new recipe
 *     produces:
 *       - application/json
 *     security:
 *       - JWT: []
 *     parameters:
 *       - name: recipe
 *         type: object
 *         description: Recipe object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/NewRecipe'
 *     responses:
 *       201:
 *         description: Returns a created recipe
 *         schema:
 *           $ref: '#/components/schemas/Recipe'
 */
router.post(
  '/recipes',
  authService.authenticate(Strategy.Bearer),
  validate(validateCreateRecipe),
  recipeController.createRecipe,
);

/**
 * @swagger
 * /recipes/all:
 *   get:
 *     tags:
 *       - Recipes
 *     description: Gets a list of all recipes
 *     produces:
 *       - application/json
 *     security:
 *       - JWT: []
 *     parameters:
 *       - name: page
 *         description: Page number
 *         in: query
 *       - name: limit
 *         description: Number of recipes per page
 *         in: query
 *     responses:
 *       200:
 *         description: Returns a recipe list
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Recipe'
 */
router.get(
  '/recipes/all',
  authService.authenticate(Strategy.Bearer),
  authController.authorizeAdmin,
  validate(validateGetAllRecipes),
  recipeController.getAllRecipes,
);

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     tags:
 *       - Recipes
 *     description: Gets a recipe by id
 *     produces:
 *       - application/json
 *     security:
 *       - JWT: []
 *     parameters:
 *       - name: id
 *         description: Id of the recipe
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a recipe
 *         schema:
 *           $ref: '#/components/schemas/Recipe'
 */
router.get(
  '/recipes/:id',
  authService.authenticate(Strategy.Bearer),
  validate(validateGetRecipe),
  recipeController.getRecipe,
);

/**
 * @swagger
 * /recipes/{id}:
 *   put:
 *     tags:
 *       - Recipes
 *     description: Updates a recipe
 *     produces:
 *       - application/json
 *     security:
 *       - JWT: []
 *     parameters:
 *       - name: New recipe
 *         type: object
 *         description: Values to update
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/NewRecipe'
 *     responses:
 *       200:
 *         description: Returns an updated recipe
 *         schema:
 *           $ref: '#/components/schemas/Recipe'
 */
router.put(
  '/recipes/:id',
  authService.authenticate(Strategy.Bearer),
  validate(validateUpdateRecipe),
  recipeController.updateRecipe,
);

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     tags:
 *       - Recipes
 *     description: Deletes a recipe
 *     produces:
 *       - application/json
 *     security:
 *       - JWT: []
 *     parameters:
 *       - name: id
 *         description: Id of the recipe
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a deleted recipe
 *         schema:
 *           $ref: '#/components/schemas/Recipe'
 */
router.delete(
  '/recipes/:id',
  authService.authenticate(Strategy.Bearer),
  validate(validateRemoveRecipe),
  recipeController.removeRecipe,
);

/**
 * @swagger
 * /recipes/search/{query}:
 *   get:
 *     tags:
 *       - Recipes
 *     description: Searches for recipes by title
 *     produces:
 *       - application/json
 *     security:
 *       - JWT: []
 *     parameters:
 *       - name: query
 *         description: query to search for
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a recipe
 *         schema:
 *           $ref: '#/components/schemas/Recipe'
 */
router.get(
  '/recipes/search/:query',
  authService.authenticate(Strategy.Bearer),
  validate(validateSearchRecipes),
  recipeController.searchRecipes,
);

export default router;
