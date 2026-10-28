import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import {
  getAllProjects,
  reviewProject,
  getProjectStats,
  getProjectById,
} from "./mentor.controller.js";

const router = Router();

router.use(authenticate, authorize("MENTOR", "ADMIN"));

router.get("/projects", getAllProjects);
router.get("/stats", getProjectStats);
router.get("/projects/:id", getProjectById);
router.patch("/projects/:id/review", reviewProject);

export default router;
