import { Router } from "express";
import { login, signup } from "./auth.controller.js";
import { authLimiter } from "./auth.ratelimit.js";

const router = Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);

export default router;
