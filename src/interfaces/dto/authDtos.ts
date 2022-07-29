import { IUser } from '../user';

export interface authorizeUserDto {
  authorization: string;
}
export interface authorizeAdminDto {
  user: IUser;
}
