export interface RegisterDto {
  username: string;
  password: string;
}

export interface GetUserDto {
  id: string;
}

export interface RemoveUserDto {
  id: string;
}

export interface GetAllUsersDto {
  page: number;
  limit: number;
}
