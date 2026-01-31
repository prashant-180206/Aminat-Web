import mongoose from "mongoose";

const subtopicSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
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

export default mongoose.models.Subtopic ||
  mongoose.model("Subtopic", subtopicSchema);
