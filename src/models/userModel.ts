import { Schema, Model, model } from 'mongoose';
import { UserObject } from '../interfaces/user';

interface UserMethods {
  comparePassword(password: string): Promise<boolean>;
  compareToken(token: string): boolean;
}

type UserModel = Model<UserObject, unknown, UserMethods>;

const userSchema = new Schema<UserObject, UserModel, UserMethods>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//method for checking whether provided token is the same as the last generated token
userSchema.methods.compareToken = function (token: string): boolean {
  return token === this.refreshToken;
};

export const User = model<UserObject, UserModel>('User', userSchema);
