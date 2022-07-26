import { IUser } from '../user';

export interface createRecipeDto {
  user: IUser;
  title: string;
  imageUrl: string;
  body: string;
}

export interface updateRecipeDto {
  id: string;
  user: IUser;
  title: string;
  imageUrl: string;
  body: string;
}

export interface getAllRecipesDto {
  page: number;
  limit: number;
}

export interface getRecipeDto {
  id: string;
}

export interface getRecipesByOwnerDto {
  user: IUser;
  page: number;
  limit: number;
}

export interface removeRecipeDto {
  id: string;
  user: IUser;
}

export interface searchRecipesDto {
  query: string;
  page: number;
  limit: number;
}
