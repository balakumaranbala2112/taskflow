import { Router } from "express";

import {
  register,
  login,
  getMe,
  logout,
  refreshToken,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const router = Router();

// Public routes
router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/refresh", refreshToken);
router.post("/logout", logout);

// Protected routes
router.get("/me", protect, getMe);

export default router;
