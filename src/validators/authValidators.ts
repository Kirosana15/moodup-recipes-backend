import { body, header, ValidationChain } from 'express-validator';

const validateToken = header('authorization').isJWT();
const validateUser = body('user').exists();

export const validateAuthorizeUser: ValidationChain[] = [validateToken];
export const validateAuthorizeAdmin: ValidationChain[] = [validateUser];
