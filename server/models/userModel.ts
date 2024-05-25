import mongoose, { Schema, Model, Document } from "mongoose";

interface InterUser extends Document {
  username: string;
  email: string;
  password: string;
  number: number;
  uId: string;
}

const userSchema: Schema = new mongoose.Schema({
  uId: { type: String, requried: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: true },
  password: { type: String, required: true },
});

const User: Model<InterUser> = mongoose.model<InterUser>("User", userSchema);
export default User;
