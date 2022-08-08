import 'dotenv/config';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { mockId, mockUsername } from './mockUser';

const TOKEN_KEY = process.env.TOKEN_KEY || 'secret';

export const generateToken = ({ id: id = mockId, username: username = mockUsername, isAdmin: isAdmin = true }) => {
  return jwt.sign({ id, username, isAdmin }, TOKEN_KEY);
};

export const mockInvalidToken = faker.datatype.string(30);
export const mockValidToken = generateToken({});
