import Notes from "../models/Notes.js";
import { Enrollment } from "../models/Enrollment.js";


// ================= ADMIN UPLOAD NOTES =================
export const uploadNotes = async (req, res) => {
  try {
    const { title, description, courseId } = req.body || {};

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "PDF required" });
    }

    if (!title || !courseId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const notes = await Notes.create({
      title,
      description,
      courseId,
      pdf: req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: "Notes uploaded",
      notes,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= ADMIN GET ALL NOTES =================
export const getAllNotes = async (req, res) => {
  try {
    const notes = await Notes.find()
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json(notes);

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ================= USER GET COURSE NOTES =================
export const getCourseNotes = async (req, res) => {
  try {
    const { courseId, userId } = req.params;

    // check enrollment
    const enrolled = await Enrollment.findOne({
      userId,
      courseId,
      status: "active",
    });

    if (!enrolled) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const notes = await Notes.find({ courseId })
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json(notes);

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ================= DELETE NOTE (OPTIONAL BUT REQUIRED FOR ADMIN UI) =================
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    await Notes.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Note deleted",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};