import { Schema, Model, model } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser {
  username: string;
  password: string;
  isAdmin?: boolean;
  refreshToken?: string;
  createdAt: Date;
}

interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
  compareToken(token: string): boolean;
}

type UserModel = Model<IUser, unknown, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
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

//method for comparing user password
userSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

//method for checking whether provided token is the same as the last generated token
userSchema.methods.compareToken = function (token: string): boolean {
  return token === this.refreshToken;
};

export const User = model<IUser, UserModel>('User', userSchema);
