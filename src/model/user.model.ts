import mongoose,{Schema,Document} from "mongoose";
import { IMessage } from "./message.model";

export interface IUser extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    // this message field will a array of type {Message}
    messages: IMessage[];
}

const UserSchema:Schema<IUser> = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true,
      },
      email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        // to check that you enter valid email we use regex
        match: [
          /[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}/,
          "please enter valid email",
        ],
      },
      password: {
        type: String,
        required: [true, "password is required"],
      },
      verifyCode: {
        type: String,
        required: [true, "verify code is required"],
      },
      verifyCodeExpiry: {
        type: Date,
        required: [true, "verify code expiry is required"],
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      isAcceptingMessages: {
        type: Boolean,
        default: false,
      },
      messages: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Message',
        default: []
      }
})

const UserModel = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

export default UserModel;