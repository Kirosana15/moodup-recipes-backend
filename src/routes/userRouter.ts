//Router for user authentication

import express from 'express';

import authController from '../controllers/authController';
import { UserController } from '../controllers/userController';
import { Strategy } from '../interfaces/strategy';
import { authService } from '../services/authService';
import {
  validateGetAllUsers,
  validateGetUser,
  validateLogin,
  validateRegister,
  validateRemoveUser,
} from '../validators/userValidators';
import { validate } from '../validators/validators';

const router = express.Router();
const userController = new UserController();

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Users
 *     description: Creates a new user
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         content:
 *           $ref: '#/components/schemas/Login'
 *     responses:
 *       201:
 *         description: Successfully created user
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/User'
 *       400:
 *         description: Duplicate username
 *         content:
 *          text/plain:
 *           schema:
 *            type: string
 *            example: User already exists
 */
router.post('/register', validate(validateRegister), userController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     security:
 *       - basicAuth: []
 *     tags:
 *       - Users
 *     description: Logs in a user
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Tokens'
 *       401:
 *          description: Authentication failed
 */
router.post('/login', validate(validateLogin), authService.authenticate(Strategy.Basic), userController.login);

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns a list of all users
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         description: Page number
 *         in: query
 *       - name: limit
 *         description: Limit of users per page
 *         in: query
 *     responses:
 *       200:
 *         description: Returns a list of all users
 *         content:
 *          application/json:
 *            schema:
 *             type: array
 *             items:
 *              $ref: '#/components/schemas/UserBasicData'
 */
router.get(
  '/users',
  authService.authenticate(Strategy.Bearer),
  authController.authorizeAdmin,
  validate(validateGetAllUsers),
  userController.getAllUsers,
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns user information
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         description: Id of the user
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Returns user information
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *          text/plain:
 *            schema:
 *              type: string
 */
router.get('/users/:id', authService.authenticate(Strategy.Bearer), validate(validateGetUser), userController.getUser);
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     description: Deletes a user
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         description: Id of the user
 *         in: path
 *     responses:
 *       200:
 *         description: Returns deleted users' information
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *          text/plain:
 *            schema:
 *              type: string
 */
router.delete(
  '/users/:id',
  authService.authenticate(Strategy.Bearer),
  validate(validateRemoveUser),
  userController.removeUser,
);

/**
 * @swagger
 * /profile:
 *   get:
 *     tags:
 *       - Users
 *     description: Fetches profile of a logged in user
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns profile of a logged in user
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TokenData'
 */
router.get('/profile', authService.authenticate(Strategy.Bearer), userController.getProfile);

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     tags:
 *       - Users
 *     description: Refreshes a user's tokens
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns new tokens
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Tokens'
 */
router.post('/refresh-token', authService.authenticate(Strategy.RefreshBearer), userController.refreshToken);

export default router;
