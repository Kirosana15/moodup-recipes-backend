import {
  body,
  param,
  query,
  header,
  ValidationChain,
  validationResult,
} from 'express-validator';
import express from 'express';
//unnecessary
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
