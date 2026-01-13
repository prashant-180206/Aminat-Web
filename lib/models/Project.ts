import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  name: string;
  ownerId: string;
  description?: string;
  scenes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    ownerId: { type: String, required: true, index: true },
    description: { type: String },
    scenes: [{ type: Schema.Types.ObjectId, ref: "Scene" }],
  },
  { timestamps: true }
);

ProjectSchema.index({ ownerId: 1, name: 1 });

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
