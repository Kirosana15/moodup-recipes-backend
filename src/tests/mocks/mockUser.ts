import { faker } from '@faker-js/faker';
import { User, UserPayload } from '../../models/userModel';

export const mockUsername = faker.internet.userName();
export const mockPassword = faker.internet.password();
export const mockId = faker.database.mongodbObjectId();
export const mockToken = faker.datatype.string(30);

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

export const saveUser = async (): Promise<User> => {
  return <User>await new User(generateUser()).save();
};

export const saveUsers = async (n: number): Promise<User[]> => {
  return <User[]>await User.insertMany(generateUsers(n));
};
