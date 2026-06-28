import CertificateApplication from "../models/CertificateApplication.js";
import { User } from "../models/userModel.js";
import Course from "../models/Course.js";
import { Enrollment } from "../models/Enrollment.js";

// ===================== APPLY FOR CERTIFICATE =====================
export const applyCertificate = async (req, res) => {
  try {
    const { userId, courseId, message } = req.body;

    if (!userId || !courseId || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (userId, courseId, message)",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const enrollment = await Enrollment.findOne({
      userId,
      courseId,
      status: "active",
    });
    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: "You are not enrolled in this course or course not completed",
      });
    }

    const existing = await CertificateApplication.findOne({ userId, courseId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this course certificate",
      });
    }

    const application = new CertificateApplication({
      userId,
      courseId,
      message,
      status: "pending",
    });
    await application.save();
    await application.populate("courseId", "title");

    const responseData = {
      ...application._doc,
      certificateUrl: null,
    };

    res.status(201).json({
      success: true,
      message: "Certificate application submitted successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Apply certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

// ===================== GET USER APPLICATIONS =====================
export const getUserApplications = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const applications = await CertificateApplication.find({ userId })
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    const formatted = applications.map((app) => ({
      _id: app._id,
      courseTitle: app.courseId?.title || "Unknown Course",
      message: app.message,
      status: app.status,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      adminRemark: app.adminRemark,
      certificateUrl: app.certificateUrl || null,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Fetch user applications error:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

// ===================== ADMIN: UPDATE STATUS =====================
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, adminRemark } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed: pending, approved, rejected",
      });
    }

    const application = await CertificateApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = status;
    if (adminRemark !== undefined) {
      application.adminRemark = adminRemark;
    }
    await application.save();
    await application.populate("courseId", "title");

    const responseData = {
      ...application._doc,
      certificateUrl: application.certificateUrl || null,
    };

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: responseData,
    });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};

// ===================== ADMIN: GET ALL APPLICATIONS =====================
export const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const applications = await CertificateApplication.find(filter)
      .populate("userId", "username email fullname")
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    const data = applications.map((app) => ({
      ...app._doc,
      certificateUrl: app.certificateUrl || null,
    }));

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Get all applications error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===================== UPLOAD CERTIFICATE (ADMIN) =====================
export const uploadCertificate = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select a PDF or image file.",
      });
    }

    const application = await CertificateApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Cannot upload certificate for a rejected application.",
      });
    }

    // ✅ Fixed: use "/uploads" (plural) – matches static route
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const fileUrl = `${baseUrl}/uploads/certificates/${req.file.filename}`;

    application.certificateUrl = fileUrl;
    await application.save();

    await application.populate("courseId", "title");

    const responseData = {
      ...application._doc,
      certificateUrl: application.certificateUrl,
    };

    res.status(200).json({
      success: true,
      message: "Certificate uploaded successfully.",
      data: responseData,
    });
  } catch (error) {
    console.error("Upload certificate error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during upload.",
    });
  }
};