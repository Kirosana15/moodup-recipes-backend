import { query, param, ValidationChain, body } from 'express-validator';

const validateId = param('id').isMongoId();
const validatePage = query('page').optional().isInt().toInt();
const validateLimit = query('limit').optional().isInt().toInt();
const validateTitle = body('title')
  .optional()
  .isLength({ min: 3, max: 20 })
  .trim()
  .stripLow(false)
  .escape();
const validateImageUrl = body('imageUrl').optional().isURL().escape();
const validateBody = body('body')
  .optional()
  .isLength({ min: 20, max: 1000 })
  .trim()
  .escape();
const validateQuery = param('query').isAlpha().trim();

export const validateGetRecipes: ValidationChain[] = [
  validatePage,
  validateLimit,
];

export const validateGetAllRecipes: ValidationChain[] = [
  validatePage,
  validateLimit,
];

export const validateCreateRecipe: ValidationChain[] = [
  validateTitle,
  validateImageUrl,
  validateBody,
];

export const validateUpdateRecipe: ValidationChain[] = [
  validateId,
  validateImageUrl,
  validateBody,
];

export const validateSearchRecipes: ValidationChain[] = [
  validateQuery,
  validatePage,
  validateLimit,
];

export const validateRemoveRecipe: ValidationChain[] = [validateId];
export const validateGetRecipe: ValidationChain[] = [validateId];
