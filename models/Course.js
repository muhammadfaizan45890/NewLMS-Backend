// ================= models/Course.js =================

import mongoose from "mongoose";

// ================= MODULE SCHEMA =================
const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ================= COURSE SCHEMA =================
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ================= MODULES =================
    modules: [moduleSchema],
  },
  {
    timestamps: true,
  }
);

// ================= MODEL =================
const Course = mongoose.model(
  "Course",
  courseSchema
);

// ================= EXPORT =================
export default Course;