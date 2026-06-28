import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true, // 🔥 improves query speed for course modules
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    youtubeUrl: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// prevent model overwrite issue in dev (VERY IMPORTANT)
const Module =
  mongoose.models.Module || mongoose.model("Module", moduleSchema);

export default Module;