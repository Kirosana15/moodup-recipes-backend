import { faker } from '@faker-js/faker';
import { IUser, UserPayload } from '../../interfaces/user';
import { User } from '../../models/userModel';

export const mockUsername = faker.name.firstName();
export const mockPassword = faker.internet.password();
export const mockId = faker.database.mongodbObjectId();

export const generateUser = (): UserPayload => {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    createdAt: faker.date.past(),
  };
};

export const generateUsers = (n: number): UserPayload[] => {
  return Array.from(Array(n), generateUser);
};

export const saveUser = async (): Promise<IUser> => {
  return <IUser>await new User(generateUser()).save();
};

export const saveUsers = async (n: number): Promise<IUser[]> => {
  return <IUser[]>await User.insertMany(generateUsers(n));
};

export const mockBasicAuthString = (username: string, password: string): string => {
  const plainString = `${username}:${password}`;
  const b64String = Buffer.from(plainString).toString('base64');
  return 'Basic ' + b64String;
};
