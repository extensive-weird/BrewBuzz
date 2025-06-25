//Returns homepage data for authenticated users.


import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.mjs";
import { getHomepage } from "../controllers/homepageController.mjs";

const router = express.Router();

// Route for shared homepage
router.get("/api/homepage", authenticateToken, getHomepage);

export default router;
