import { IUser } from '../user';

export interface registerDto {
  username: string;
  password: string;
}

export interface loginDto {
  username: string;
  password: string;
}

export interface getProfileDto {
  user: IUser;
}

export interface getUserDto {
  id: string;
}

export interface removeUserDto {
  id: string;
}

export interface getAllUsersDto {
  page: number;
  limit: number;
}

export interface refreshTokenDto {
  authorization: string;
}
