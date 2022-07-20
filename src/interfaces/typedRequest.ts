import { User } from './user';

export interface TypedBody {
  user: User;
  title: string;
  body: string;
  username: string;
  password: string;
}

export interface TypedQuery {
  page: string;
  limit: string;
}

interface TypedParams {
  id: string;
  query: string;
}

interface TypedHeaders {
  authorization: string;
}

export interface TypedRequest extends Express.Request {
  body: TypedBody;
  query: TypedQuery;
  params: TypedParams;
  headers: TypedHeaders;
}
