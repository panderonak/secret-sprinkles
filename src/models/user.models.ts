import mongoose, { Document, Schema } from "mongoose";
import { MessageSchema, Message } from "./message.models";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verificationCode: string;
  verificationCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
    trim: true,
    match: [
      /^[A-Za-z][A-Za-z0-9_-]{1,18}[A-Za-z0-9]$/,
      "Please use a valid username.",
    ],
    unique: [true, "Username already exists."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: [true, "Email already exists."],
    match: [
      /^[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~]+(\.[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~]+)*@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/,
      "Please use a valid email address.",
    ],
  },
  password: {
    type: String,
    match: [
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d_@$!%*?&]{8,64}$/,
      "Please use a valid password.",
    ],
    required: [true, "Password is required."],
  },
  verificationCode: {
    type: String,
    required: [true, "Verification Code is required."],
  },
  verificationCodeExpiry: {
    type: Date,
    required: [true, "Verification Code Expiry is required."],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: {
    type: [MessageSchema],
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
