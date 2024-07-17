import mongoose, { Schema, Document } from 'mongoose';



export interface UserType extends Document {
    username: string;
    email: string;
    phonenumber: string;
    password: string;
    firstname: string;
    middlename: string;
    lastname: string;
    isVerified: boolean;
    verifyCode: string;
    verifyCodeExpire: Date;
    role: number;
}

// Updated User schema
const UserSchema: Schema<UserType> = new mongoose.Schema({
    username: {
      type: String,
      required: [true, "Username required"],
      trim: true,
    },
    firstname: {
      type: String,
      required: [true, "Firstname required"],
      trim: true,
    },
    middlename: {
      type: String,
      default: "",
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Lastname required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email required"],
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g,
        "Invalid email",
      ],
    },
    phonenumber: {
      type: String,
      required: true,
      match: [
        /^\+?(\d{1,4})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
        "Invalid phone number",
      ],
      validate: {
        validator: function (v: string) {
          return /^\+?(\d{1,4})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    password: {
      type: String,
      required: [true, "Password required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: String,
      required: [true, "VerifyCode required"],
    },
    verifyCodeExpire: {
      type: Date,
      required: [true, "VerifyCodeExpire required"],
    },
    role: {
      type: Number,
      enum: [1, 2, 3],
      default: 2,
    },
  },
  { timestamps: true });

const UserModel =
  (mongoose.models.User as mongoose.Model<UserType>) ||
  mongoose.model<UserType>('User', UserSchema);

export default UserModel;