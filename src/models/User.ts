import mongoose, { Schema, Document } from "mongoose";
import { IArik, ArikSchema } from "./Arik";
import { INova, NovaSchema } from "./Nova";
import { SubscriptionType } from "../lib/constants";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: string;
  email: string;
  username: string;
  password?: string;
  passwordHash: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLoginAttempt?: Date;
  loginAttempts: number;
  locked: boolean;
  arikTemplate: IArik;
  novaTemplate: INova;
  selectedTemplates: string[];
  subscription: SubscriptionType;
  preferences: {
    colors: string[];
    profession: string;
  };
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLoginAttempt: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    locked: {
      type: Boolean,
      default: false,
    },
    arikTemplate: {
      type: ArikSchema,
      default: {},
    },
    novaTemplate: {
      type: NovaSchema,
      default: {},
    },
    selectedTemplates: [
      {
        type: String,
      },
    ],
    subscription: {
      type: String,
      enum: Object.values(SubscriptionType),
      default: SubscriptionType.TRIAL,
    },
    preferences: {
      colors: {
        type: [String],
        default: [],
      },
      profession: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
      default: {},
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for password that only sets, never gets
UserSchema.virtual("password").set(function (password: string) {
  if (password) {
    const salt = bcrypt.genSaltSync(12);
    this.passwordHash = bcrypt.hashSync(password, salt);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  if (!password || !this.passwordHash) return false;
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model<IUser>("User", UserSchema);
