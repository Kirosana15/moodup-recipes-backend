/* eslint-disable @typescript-eslint/no-namespace */
export interface IUser {
  id: string;
  username: string;
  password: string;
  isAdmin?: boolean;
  refreshToken?: string;
  createdAt: Date;
}

export type UserPayload = Omit<IUser, 'id'>;
declare global {
  namespace Express {
    interface User extends IUser {
      id: string;
      username: string;
      password: string;
      isAdmin?: boolean;
      refreshToken?: string;
      createdAt: Date;
    }
  }
}
