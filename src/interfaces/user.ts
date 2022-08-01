export interface IUser {
  id: string;
  username: string;
  password: string;
  isAdmin?: boolean;
  refreshToken?: string;
  createdAt: Date;
}

export type UserPayload = Omit<IUser, 'id'>;
