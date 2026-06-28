import express from "express";
import {
  getAllUsers,
  deleteUser,
  getDashboardStats,
  addCourse,
  getCourses,
  getCourseById,
  addModuleToCourse,
  deleteModuleFromCourse,
  deleteCourse
} from "../controllers/adminController.js";

const router = express.Router();

// ================= USERS =================
router.get("/users", getAllUsers);
router.delete("/user/:id", deleteUser);

// ================= DASHBOARD =================
router.get("/dashboard", getDashboardStats);

// ================= COURSES =================
router.post("/course", addCourse);
router.get("/courses", getCourses);
router.get("/course/:id", getCourseById); // ✅ ONLY ONCE
router.delete("/course/:id", deleteCourse)


// ================= MODULES (EMBEDDED SYSTEM) =================
router.post("/course/:id/module", addModuleToCourse);
router.delete("/course/:courseId/module/:moduleIndex", deleteModuleFromCourse);

export default router;