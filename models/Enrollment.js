import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    paymentMethod: {
      type: String,
      default: "free",
    },

    status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "refund"],
    },

    // ✅ Explicit enrollment date (optional but useful for LMS UI)
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // keeps createdAt + updatedAt
);

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);