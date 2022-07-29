import mongoose, { Model } from 'mongoose';

export const DB_URI = 'mongodb://localhost:27017';
export const CONN_ERR = 'DB connect error';
export const DC_ERR = 'DB disconnect error';
export const MATCH_JWT = /^(?:[\w-]+\.){2}[\w-]+$/; //matches a JWT token

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
