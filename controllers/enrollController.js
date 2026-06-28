import { Enrollment } from "../models/Enrollment.js"

// ================= ENROLL COURSE =================
export const enrollCourse = async (req, res) => {
  try {
    const { userId, courseId, paymentMethod } = req.body

    // ================= VALIDATION =================
    if (!userId || !courseId) {
      return res.status(400).json({
        message: "User ID or Course ID missing"
      })
    }

    // ================= CHECK EXISTING =================
    const existing = await Enrollment.findOne({
      userId,
      courseId
    })

    if (existing) {
      return res.status(400).json({
        message: `Already enrolled with status: ${existing.status}`
      })
    }

    // ================= CREATE NEW =================
    const enrollment = await Enrollment.create({
      userId,
      courseId,
      paymentMethod,
      status: "pending"
    })

    res.status(201).json(enrollment)

  } catch (err) {
    res.status(500).json({
      message: "Enrollment failed",
      error: err.message
    })
  }
}

// ================= GET USER COURSES =================
export const getUserCourses = async (req, res) => {
  try {
    const courses = await Enrollment.find({
      userId: req.params.userId
    }).populate("courseId")

    res.json(courses)

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch user courses",
      error: err.message
    })
  }
}

// ================= GET ALL ENROLLMENTS (ADMIN) =================
export const getAllEnrollments = async (req, res) => {
  try {
    const data = await Enrollment.find()
      .populate("userId", "username email")
      .populate("courseId", "title description")

    res.json(data)

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch enrollments",
      error: error.message
    })
  }
}

// ================= UPDATE STATUS (ADMIN) =================
export const updateStatus = async (req, res) => {
  try {
    const updated = await Enrollment.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status
      },
      {
        new: true
      }
    )

    if (!updated) {
      return res.status(404).json({
        message: "Enrollment not found"
      })
    }

    res.json(updated)

  } catch (err) {
    res.status(500).json({
      message: "Failed to update status",
      error: err.message
    })
  }
}

// ================= DELETE ENROLLMENT =================
export const deleteEnrollment = async (req, res) => {
  try {

    const deletedEnrollment = await Enrollment.findByIdAndDelete(
      req.params.id
    )

    if (!deletedEnrollment) {
      return res.status(404).json({
        message: "Enrollment not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "Enrollment deleted successfully"
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete enrollment",
      error: error.message
    })
  }
}