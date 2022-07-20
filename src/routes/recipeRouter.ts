//Router for recipe endpoints

import express from 'express';
import AuthController from '../controllers/authController';
import { RecipeController } from '../controllers/recipeController';
import { validate } from '../validators/validators';

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
  authController.authorizeUser,
  validate(['body', 'title']),
  recipeController.createRecipe
);
router.get(
  '/recipes',
  authController.authorizeUser,
  validate(['page', 'limit']),
  recipeController.getRecipesByOwner
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
 *   put:
 *     tags:
 *       - Recipes
 *     description: Updates a recipe
 *     produces:
 *       - application/json
 *     security:
 *       - JWT: []
 *     parameters:
 *       - name: id
 *         description: Id of the recipe
 *         in: path
 *         required: true
 *       - name: body
 *         description: An updated body of the recipe
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: Returns an updated recipe
 *         schema:
 *           $ref: '#/components/schemas/Recipe'
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
router.get(
  '/recipes/all',
  authController.authorizeUser,
  authController.authorizeAdmin,
  validate(['page', 'limit']),
  recipeController.getAllRecipes
);
router.get(
  '/recipes/:id',
  authController.authorizeUser,
  validate(['id']),
  recipeController.getRecipe
);
router.put(
  '/recipes/:id',
  authController.authorizeUser,
  validate(['id', 'body']),
  recipeController.updateRecipe
);
router.delete(
  '/recipes/:id',
  authController.authorizeUser,
  validate(['id']),
  recipeController.removeRecipe
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
  authController.authorizeUser,
  validate(['query', 'page', 'limit']),
  recipeController.searchRecipes
);

export default router;
