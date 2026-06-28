import express from "express";
import {
  createModule,
  getModulesByCourse,
  deleteModule,
  updateModule,
  getModuleById,
  getCourseById
} from "../controllers/moduleController.js";


const router = express.Router();

router.post("/create", createModule);
router.get("/course/:courseId", getModulesByCourse);
router.delete("/:id", deleteModule);
router.put("/:id", updateModule);
router.get("/:id", getModuleById);
router.get("/course/:id", getCourseById);

export default router;