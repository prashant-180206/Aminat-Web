import mongoose, { Schema, Document, Model } from "mongoose";

export interface IScene extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  thumbnail?: string;
  version?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const SceneSchema = new Schema<IScene>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
    thumbnail: { type: String },
    version: { type: Number, default: 1 },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

SceneSchema.index({ projectId: 1, title: 1 });

const Scene: Model<IScene> =
  mongoose.models.Scene || mongoose.model<IScene>("Scene", SceneSchema);

export default Scene;
