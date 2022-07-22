import { Query } from 'express-serve-static-core';
import { IUser } from './user';

interface TypedBody {
  user: IUser;
  title: string;
  body: string;
  username: string;
  password: string;
}

interface TypedQuery extends Query {
  page: string;
  limit: string;
}

interface TypedParams {
  id: string;
  query: string;
}

interface TypedHeaders {
  authorization?: string;
}

export interface TypedRequest extends Express.Request {
  body: TypedBody;
  query: TypedQuery;
  params: TypedParams;
  headers: TypedHeaders;
}
