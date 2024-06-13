import mongoose, { Schema, Model, Document } from "mongoose";

interface canvasInterface extends Document {
  drawData: string;
  projectName: string;
  projectId: string;
}

const canvas: Schema = new mongoose.Schema({
  drawData: { type: String },
  projectName: { type: String },
  projectId: { type: String },
});

const CanvasModel: Model<canvasInterface> = mongoose.model<canvasInterface>(
  "CanvasModel",
  canvas,
);

export default CanvasModel;
