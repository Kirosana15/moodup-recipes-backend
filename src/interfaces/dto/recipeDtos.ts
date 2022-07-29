export interface createRecipeDto {
  title: string;
  imageUrl: string;
  body: string;
}

export interface updateRecipeDto {
  id: string;
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
  page: number;
  limit: number;
}

export interface removeRecipeDto {
  id: string;
}

export interface searchRecipesDto {
  query: string;
  page: number;
  limit: number;
}
