import express from "express";
import {
  applyCertificate,
  getUserApplications,
  getAllApplications,
  updateApplicationStatus,
  uploadCertificate,
} from "../controllers/certificateController.js";
import { isAuthenticated, isAdmin } from "../middleware/isAuthenticated.js"; // ✅ import both
import { upload } from "../middleware/upload.js";

const router = express.Router();

// ================================
//       USER ROUTES
// ================================
router.post("/apply", isAuthenticated, applyCertificate);
router.get("/user/:userId", isAuthenticated, getUserApplications);

// ================================
//       ADMIN ROUTES
// ================================
// All admin routes require authentication + admin role
router.get("/admin/all", isAuthenticated, isAdmin, getAllApplications);
router.put("/admin/:applicationId/status", isAuthenticated, isAdmin, updateApplicationStatus);

// Upload certificate – admin only
router.post(
  "/admin/:applicationId/upload",
  isAuthenticated,
  upload.single("certificate"), // field name must match frontend
  uploadCertificate
);

export default router;