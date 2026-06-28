import Refund from "../models/refundModel.js";
import Course from "../models/Course.js";


// ================= CREATE REFUND =================
export const createRefund = async (req, res) => {
  try {
    const { userId, courseId, reason } = req.body;

    if (!userId || !courseId || !reason) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ================= FIND COURSE =================
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // ================= CHECK EXISTING =================
    const existingRefund = await Refund.findOne({
      userId,
      courseId,
      status: "pending",
    });

    if (existingRefund) {
      return res.status(400).json({
        message: "Refund request already submitted",
      });
    }

    // ================= CREATE REFUND =================
    const refund = await Refund.create({
      userId,
      courseId,
      courseTitle: course.title,
      reason,
    });

    res.status(201).json({
      message: "Refund request submitted successfully",
      refund,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


// ================= USER REFUNDS =================
export const getUserRefunds = async (req, res) => {
  try {
    const { userId } = req.params;

    const refunds = await Refund.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(refunds);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


// ================= ALL REFUNDS =================
export const getAllRefunds = async (req, res) => {
  try {

    const refunds = await Refund.find()
      .populate("userId")
      .populate("courseId")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(refunds);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


// ================= UPDATE REFUND STATUS =================
export const updateRefundStatus = async (req, res) => {
  try {

    const { refundId } = req.params;
    const { status } = req.body;

    // ================= VALIDATION =================
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // ================= FIND & UPDATE =================
    const refund = await Refund.findByIdAndUpdate(
      refundId,
      {
        status,
      },
      {
        new: true,
      }
    );

    if (!refund) {
      return res.status(404).json({
        message: "Refund request not found",
      });
    }

    res.status(200).json({
      message: `Refund ${status} successfully`,
      refund,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};