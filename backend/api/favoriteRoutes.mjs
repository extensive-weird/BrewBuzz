// Handles routes for favorite features

import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.mjs";
import { toggleFavorite, getFavorites } from "../controllers/favoriteController.mjs";

const router = express.Router();

// Route to toggle favorite
router.post("/api/favorites/:businessId", authenticateToken, toggleFavorite);

// Route to get favorite list
router.get("/api/favorites", authenticateToken, getFavorites);

export default router;
