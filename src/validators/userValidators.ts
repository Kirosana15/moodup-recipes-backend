import { query, param, ValidationChain, body } from 'express-validator';

const validateId = param('id').isMongoId();
const validatePage = query('page').optional().isInt().toInt();
const validateLimit = query('limit').optional().isInt().toInt();
const validateUsername = body('username').isAlphanumeric().isLength({ min: 3, max: 15 }).trim();
const validatePassword = body('password').isLength({ min: 6, max: 200 });

export const validateRegister: ValidationChain[] = [validateUsername, validatePassword];

export const validateLogin: ValidationChain[] = [validateUsername, validatePassword];

export const validateGetAllUsers: ValidationChain[] = [validatePage, validateLimit];

export const validateGetUser: ValidationChain[] = [validateId];
export const validateRemoveUser: ValidationChain[] = [validateId];
