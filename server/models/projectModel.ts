import mongoose, { Model, Document } from "mongoose";

interface projectInterface extends Document {
  userId: string;
  projectName: string;
  username: string;
  numberOfUsers: number;
  projectKey: string;
  projectId: string;
  usersJoined: [string];
}

const project = new mongoose.Schema({
  projectId: { type: String, required: true },
  projectKey: { type: String, requried: true },
  userId: { type: String, required: true },
  projectName: { type: String, required: true },
  username: { type: String, requried: true },
  numberOfUsers: { type: Number },
  usersJoined: { type: [String] },
});

const Project: Model<projectInterface> = mongoose.model<projectInterface>(
  "Project",
  project,
);
export default Project;
