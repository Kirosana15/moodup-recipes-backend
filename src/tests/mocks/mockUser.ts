import { faker } from '@faker-js/faker';

export const mockUsername = faker.internet.userName();
export const mockPassword = faker.internet.password();
export const mockId = faker.database.mongodbObjectId();
export const mockToken = faker.datatype.string(30);

export class mockUser {
  public username: string;
  public password: string;
  public createdAt: Date;
  constructor() {
    this.username = faker.internet.userName();
    this.password = faker.internet.password();
    this.createdAt = faker.date.past();
  }
}
