import { faker } from '@faker-js/faker';

export const mockUsername = faker.internet.userName();
export const mockPassword = faker.internet.password();
export const mockId = faker.database.mongodbObjectId();
export const mockToken = faker.datatype.string(30);
