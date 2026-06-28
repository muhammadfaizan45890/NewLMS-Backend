import express from "express"
import {
  enrollCourse,
  getUserCourses,
  updateStatus,
  getAllEnrollments,
  deleteEnrollment
} from "../controllers/enrollController.js"

const router = express.Router()

router.post("/enroll", enrollCourse)
router.get("/my-courses/:userId", getUserCourses)
router.put("/status/:id", updateStatus)
router.get("/all", getAllEnrollments)
router.delete("/delete/:id", deleteEnrollment)



export default router