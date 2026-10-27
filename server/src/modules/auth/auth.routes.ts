import { Router } from "express";
import { login, signup } from "./auth.controller.js";
import { rateLimiter } from "../../middlewares/ratelimit.js";

const router = Router();

router.post("/signup", rateLimiter, signup);
router.post("/login", rateLimiter, login);

export default router;
