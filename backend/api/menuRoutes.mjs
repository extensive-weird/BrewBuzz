// Return Menu page items 
import express from "express";
import { getMenu } from "../controllers/menuController.mjs";
import { authenticateToken } from "../middleware/authMiddleware.mjs";

const router = express.Router();

// Route to fetch menu for a specific business
router.get("/api/businesses/:business_id/menu", authenticateToken, getMenu);

export default router;
