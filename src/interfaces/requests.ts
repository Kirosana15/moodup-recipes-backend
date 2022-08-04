import { Request } from 'express';
import { UserObject } from './user';

export interface AuthenticatedBasicRequest extends Request {
  user?: UserObject | undefined;
}
