import { ValidationChain, validationResult } from 'express-validator';
import express from 'express';
import { TypedRequest } from '../interfaces/typedRequest';

export const validate = (validations: ValidationChain[]) => {
  return async (
    req: TypedRequest,
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
