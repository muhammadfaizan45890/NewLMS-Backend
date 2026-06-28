import express from "express";
import upload from "../middleware/uploadNotes.js"; // ✅ multer import

import {
  uploadNotes,
  getAllNotes,
  getCourseNotes,
  deleteNote
} from "../controllers/notesController.js";

const router = express.Router();

// ✅ IMPORTANT: multer middleware here
router.post("/upload", upload.single("pdf"), uploadNotes);

router.get("/all", getAllNotes);
router.get("/course/:courseId/:userId", getCourseNotes);
router.delete("/:id", deleteNote);

export default router;