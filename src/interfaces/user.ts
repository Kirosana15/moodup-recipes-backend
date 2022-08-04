export interface UserObject {
  id: string;
  username: string;
  password: string;
  isAdmin?: boolean;
  refreshToken?: string;
  createdAt: Date;
}

declare global {
  namespace Express {
    interface User extends UserObject {
      id: string;
      username: string;
      password: string;
      isAdmin?: boolean;
      refreshToken?: string;
      createdAt: Date;
    }
  }
}
export type UserPayload = Omit<UserObject, 'id'>;
