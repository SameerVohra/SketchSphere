import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
  uId: string;
  username: string;
  email: string;
  mobile: number;
  password: string;
  projects: Array<{ projectName: string; projectId: string }>;
}

const userSchema: Schema = new mongoose.Schema({
  uId: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: true },
  password: { type: String, required: true },
  projects: [{ projectName: String, projectId: String }],
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
