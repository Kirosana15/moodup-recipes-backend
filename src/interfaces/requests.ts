import { Request } from 'express';
import { IUser } from './user';

export interface AuthenticatedBasicRequest extends Request {
  user?: IUser | undefined;
}
