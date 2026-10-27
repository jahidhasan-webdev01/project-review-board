import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { createProject, getMyProjects } from "./project.controller.js";
import { rateLimiter } from "../../middlewares/ratelimit.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("STUDENT"),
  rateLimiter,
  createProject,
);

router.get("/my", authenticate, authorize("STUDENT"), getMyProjects);

export default router;
