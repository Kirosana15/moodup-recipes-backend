import { query, param, ValidationChain, body } from 'express-validator';

const validateId = param('id').isMongoId();
const validatePage = query('page').optional().isInt().toInt();
const validateLimit = query('limit').optional().isInt().toInt();
const validateTitle = body('title').isLength({ min: 3, max: 20 }).trim().stripLow(false);
const validateImageUrl = body('imageUrl').optional().isURL();
const validateBody = body('body').isLength({ min: 20, max: 1000 }).trim();
const validateQuery = param('query').isAlpha().trim();

export const validateGetRecipes: ValidationChain[] = [validatePage, validateLimit];

export const validateGetAllRecipes: ValidationChain[] = [validatePage, validateLimit];

export const validateCreateRecipe: ValidationChain[] = [validateTitle, validateImageUrl, validateBody];

export const validateUpdateRecipe: ValidationChain[] = [
  validateId,
  validateTitle.optional(),
  validateImageUrl,
  validateBody.optional(),
];

export const validateSearchRecipes: ValidationChain[] = [validateQuery, validatePage, validateLimit];

export const validateRemoveRecipe: ValidationChain[] = [validateId];
export const validateGetRecipe: ValidationChain[] = [validateId];
