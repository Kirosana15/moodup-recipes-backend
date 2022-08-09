import 'dotenv/config';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { mockUsername, mockId } from './mockUser';

const TOKEN_KEY = process.env.TOKEN_KEY || 'secret';

export const mockInvalidToken = faker.datatype.string(30);
export const mockValidToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJtb2NrVXNlciIsInBhc3N3b3JkIjoibW9ja1Bhc3N3b3JkIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNTE2MjM5MDIyfQ.qDphwJmRIcJKE5psEn1768JF907PHTLJRXOtO9Td0xA';

export const generateToken = ({ id: id = mockId, username: username = mockUsername, isAdmin: isAdmin = true }) => {
  return jwt.sign({ id, username, isAdmin }, TOKEN_KEY);
};
