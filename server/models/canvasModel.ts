import mongoose, { Model, Document } from "mongoose";

interface canvasInterface extends Document {
  userId: string;
  drawData: string;
  projectName: string;
  projectId: string;
}

const canvas = new mongoose.Schema({
  userId: { type: String },
  drawData: { type: String },
  projectName: { type: String },
  projectId: { type: String },
});

const CanvasModel: Model<canvasInterface> = mongoose.model<canvasInterface>(
  "CanvasModel",
  canvas,
);

export default CanvasModel;
