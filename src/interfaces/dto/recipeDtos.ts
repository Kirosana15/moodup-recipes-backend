export interface CreateRecipeDto {
  title: string;
  imageUrl: string;
  body: string;
}

export interface UpdateRecipeDto {
  id: string;
  title: string;
  imageUrl: string;
  body: string;
}

export interface GetAllRecipesDto {
  page: number;
  limit: number;
}

export interface GetRecipeDto {
  id: string;
}

export interface GetRecipesByOwnerDto {
  page: number;
  limit: number;
}

export interface RemoveRecipeDto {
  id: string;
}

export interface SearchRecipesDto {
  query: string;
  page: number;
  limit: number;
}
