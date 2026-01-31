import mongoose from "mongoose";

const tutorialSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    steps: [{ type: String }],
    hasScene: { type: Boolean, default: false },
    sceneData: { type: Object }, // Store scene configuration
    subtopicId: { type: String, required: true },
    topicId: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Tutorial ||
  mongoose.model("Tutorial", tutorialSchema);
