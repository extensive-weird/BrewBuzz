// Route to change password for authenticated users from User profile page

import express from "express";
import { changePassword } from "../controllers/changePasswordController.mjs";
import { authenticateToken } from "../middleware/authMiddleware.mjs";


const router = express.Router();

router.post("/api/change-password", authenticateToken, changePassword);

export default router;