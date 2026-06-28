import mongoose from 'mongoose';

const certificateApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    message: {
      type: String,
      trim: true,
      required: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminRemark: {
      type: String,
      trim: true,
      default: '',
    },
    // ✅ Field to store the uploaded certificate URL (added)
    certificateUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications for same user+course
// Using partialFilterExpression to only enforce uniqueness on non‑null fields
certificateApplicationSchema.index(
  { userId: 1, courseId: 1 },
  { unique: true, partialFilterExpression: { userId: { $exists: true }, courseId: { $exists: true } } }
);

const CertificateApplication = mongoose.model('CertificateApplication', certificateApplicationSchema);
export default CertificateApplication;