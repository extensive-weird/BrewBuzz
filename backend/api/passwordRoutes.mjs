
/* Handles PIN-based password recovery process from sign In page. */


import express from "express";
import { forgotPassword, resetPassword } from "../controllers/passwordController.mjs";

const router = express.Router();

// Forgot Password Route
router.post("/api/forgot-password", forgotPassword);

// Reset Password Route
router.post("/api/reset-password", resetPassword);

export default router;
