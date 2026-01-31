import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    questions: { type: Number, required: true },
    questionsData: [{ type: Object }], // Store actual questions
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

export default mongoose.models.Test || mongoose.model("Test", testSchema);
