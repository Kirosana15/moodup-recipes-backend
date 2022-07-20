import {
  body,
  param,
  query,
  header,
  ValidationChain,
  validationResult,
} from 'express-validator';
import express from 'express';

const checks: { [key: string]: ValidationChain } = {
  id: param('id').isMongoId(),
  title: body('title')
    .isLength({ min: 3, max: 20 })
    .trim()
    .stripLow(false)
    .escape(),
  body: body('body').isLength({ min: 20, max: 1000 }).trim().escape(),
  query: param('query').isAlpha().trim(),
  page: query('page').optional().isInt().toInt(),
  limit: query('limit').optional().isInt().toInt(),
  username: body('username')
    .isAlphanumeric()
    .isLength({ min: 3, max: 15 })
    .trim(),
  password: body('password').isLength({ min: 6, max: 200 }),
  token: header('authorization').isJWT(),
};

export const validate = (validations: ValidationChain[]) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.status(400).json({ errors: errors.array() });
  };
};
