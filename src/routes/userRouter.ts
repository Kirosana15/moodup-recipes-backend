//Router for user authentication

import express from "express";
import { UserController } from "../controllers/userController";
import AuthController from "../controllers/authController";

const router = express.Router();
const userController = new UserController();
const authController = new AuthController();

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Users
 *     description: Creates a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: login
 *         description: Login object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Login'
 *     responses:
 *       201:
 *         description: Successfully created user
 *         schema:
 *           $ref: '#/components/schemas/User'
 */
router.post("/register", userController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Users
 *     description: Logs in a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: login
 *         description: Login object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         schema:
 *           $ref: '#/components/schemas/Tokens'
 */
router.post("/login", userController.login, userController.generateToken);

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
 *       - JWT: []
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
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 */
router.get(
  "/users",
  authController.authorizeUser,
  authController.authorizeAdmin,
  userController.getAllUsers
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
 *       - JWT: []
 *     parameters:
 *       - name: id
 *         description: Id of the user
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Returns user information
 *         schema:
 *           $ref: '#/components/schemas/User'
 *   delete:
 *     tags:
 *       - Users
 *     description: Deletes a user
 *     produces:
 *       - application/json
 *     security:
 *       - JWT: []
 *     parameters:
 *       - name: id
 *         description: Id of the user
 *         in: path
 */
router.get("/users/:id", authController.authorizeUser, userController.getUser);
router.delete(
  "/users/:id",
  authController.authorizeUser,
  authController.authorizeAdmin,
  userController.removeUser
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
 *       - JWT: []
 *     responses:
 *       200:
 *         description: Returns profile of a logged in user
 *         schema:
 *           $ref: '#/components/schemas/User'
 */
router.get("/profile", authController.authorizeUser, userController.getProfile);

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
 *       - JWT: []
 *     responses:
 *       200:
 *         description: Returns new tokens
 *         schema:
 *           $ref: '#/components/schemas/User'
 */
router.post(
  "/refresh-token",
  userController.refreshToken,
  userController.generateToken
);

export default router;
