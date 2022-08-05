import { Request } from 'express';
import { User } from '../models/userModel';

export interface AuthenticatedBasicRequest extends Request {
  user?: User | undefined;
}
