//Router for recipe endpoints

import express from 'express';

import authController from '../controllers/authController';
import { RecipeController } from '../controllers/recipeController';
import { Strategy } from '../interfaces/strategy';
import { authService } from '../services/authService';
import {
  validateCreateRecipe,
  validateGetAllRecipes,
  validateGetRecipe,
  validateGetRecipes,
  validateRemoveRecipe,
  validateSearchRecipes,
  validateUpdateRecipe,
} from '../validators/recipeValidators';
import { validate } from '../validators/validators';

const router = express.Router();

const recipeController = new RecipeController();

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
 *       - bearerAuth: []
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
 *         content:
 *          application/json:
 *            schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Recipe'
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
 *       - bearerAuth: []
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
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Recipe'
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
 *       - bearerAuth: []
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
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Recipe'
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
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         description: Id of the recipe
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a recipe
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Recipe'
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
 *       - bearerAuth: []
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
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Recipe'
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
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         description: Id of the recipe
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a deleted recipe
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Recipe'
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
 *       - bearerAuth: []
 *     parameters:
 *       - name: query
 *         description: query to search for
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a recipe
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Recipe'
 */
router.get(
  '/recipes/search/:query',
  authService.authenticate(Strategy.Bearer),
  validate(validateSearchRecipes),
  recipeController.searchRecipes,
);

export default router;
