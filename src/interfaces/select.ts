export enum UserSelect {
  default = '_id username isAdmin createdAt',
  password = 'password _id username isAdmin createdAt',
  token = '_id username isAdmin createdAt refreshToken',
}
