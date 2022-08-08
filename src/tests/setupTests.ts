import mongoose, { Model } from 'mongoose';
import { DB_URI, CONN_ERR } from './constants';

export const connectToDb = async (dbName: string) => {
  try {
    await mongoose.connect(DB_URI, {
      dbName,
      autoCreate: true,
    });
  } catch (error) {
    console.log(CONN_ERR);
  }
};

export const clearCollection = async (collection: Model<undefined>) => {
  await collection.deleteMany();
};
export const clearAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany({});
  }
};
const removeAllCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.drop();
  }
};
export const closeConnection = async () => {
  await removeAllCollections();
  mongoose.disconnect();
};

export const setupTests = (testName: string, runTests: () => void) => {
  describe(`Testing ${testName}`, () => {
    beforeAll(async () => {
      await connectToDb(`${testName}-test`);
    });
    afterEach(async () => {
      await clearAllCollections();
    });
    afterAll(async () => {
      await closeConnection();
    });
    runTests();
  });
};
export const setupE2E = (testName: string, runTests: () => void) => {
  describe(`Testing ${testName}`, () => {
    afterEach(async () => {
      jest.clearAllMocks();
    });
    runTests();
  });
};
