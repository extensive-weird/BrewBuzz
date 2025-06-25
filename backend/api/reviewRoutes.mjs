// Defines the routes for review feature
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.mjs";
import {
  createOrUpdateReview,
  getReviewsByBusiness,
  deleteReview,
} from "../controllers/reviewController.mjs";

const router = express.Router();

// Create or update a review for a business
router.post(
  "/api/businesses/:business_id/reviews",
  authenticateToken,
  createOrUpdateReview
);

// Get all reviews for a business
router.get(
  "/api/businesses/:business_id/reviews",
  authenticateToken,
  getReviewsByBusiness
);

// Delete a review
router.delete("/api/reviews/:review_id", authenticateToken, deleteReview);

export default router;
