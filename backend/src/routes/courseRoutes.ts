import { Router } from "express";
import { listCourses, createCourse } from "../controllers/courseController";
import { verifyToken, requireRole } from "../middleware/auth";

const router = Router();
router.get("/", verifyToken, listCourses);
router.post("/", verifyToken, requireRole("FACULTY"), createCourse);
export default router;