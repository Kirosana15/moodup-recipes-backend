export interface registerDto {
  username: string;
  password: string;
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
