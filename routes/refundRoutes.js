import express from "express";

import {
  createRefund,
  getUserRefunds,
  getAllRefunds,
  updateRefundStatus,
} from "../controllers/refundController.js";

const router = express.Router();


// ================= CREATE =================
router.post("/create", createRefund);


// ================= USER REFUNDS =================
router.get("/user/:userId", getUserRefunds);


// ================= ALL REFUNDS =================
router.get("/all", getAllRefunds);


// ================= UPDATE STATUS =================
router.put(
  "/update/:refundId",
  updateRefundStatus
);

export default router;