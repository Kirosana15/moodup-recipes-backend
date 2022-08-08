import { query, param, ValidationChain, body, header, CustomValidator } from 'express-validator';

const validateId = param('id').isMongoId();
const validatePage = query('page').optional().isInt().toInt();
const validateLimit = query('limit').optional().isInt().toInt();
const validateUsername = body('username').isAlphanumeric().isLength({ min: 3, max: 15 }).trim();
const validatePassword = body('password').isLength({ min: 6, max: 200 });

const validateBasic: CustomValidator = (auth: string) => {
  const basicString = auth.split(' ')[1];
  const [username, password] = Buffer.from(basicString, 'base64').toString('utf-8').split(':');
  const isValidUsername = username.length >= 3 && username.length < 15 && username.match(/^[\w]+$/);
  const isValidPassword = password.length >= 6 && username.length < 200;
  return isValidPassword && isValidUsername;
};

const validateBasicAuth = header('Authorization').custom(validateBasic);

export const validateRegister: ValidationChain[] = [validateUsername, validatePassword];
export const validateLogin: ValidationChain[] = [validateBasicAuth];
export const validateGetAllUsers: ValidationChain[] = [validatePage, validateLimit];
export const validateGetUser: ValidationChain[] = [validateId];
export const validateRemoveUser: ValidationChain[] = [validateId];
