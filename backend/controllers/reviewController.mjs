/**
 * Review Controller
 * -----------------
 * Manages creation, updating, retrieval, and deletion of reviews for businesses.
 *
 * Functions:
 * - createOrUpdateReview: Allows a user to submit or update a review for a business.
 * - getReviewsByBusiness: Retrieves all reviews for a business and calculates the average rating.
 * - deleteReview: Allows users to delete their own reviews.
 */

import Review from "../models/Review.mjs";
import Business from "../models/Business.mjs";
import User from "../models/User.mjs";
// Create or Update Review
export async function createOrUpdateReview(req, res) {
  try {
    const { business_id } = req.params;
    const { rating, review } = req.body;
    const user_id = req.user.id;

    // Check if the business exists
    const business = await Business.findByPk(business_id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Check if the user already reviewed the business
    const existingReview = await Review.findOne({
      where: { user_id, business_id },
    });

    if (existingReview) {
      // Update the existing review
      existingReview.rating = rating;
      existingReview.review = review;
      await existingReview.save();
      return res
        .status(200)
        .json({
          message: "Review updated successfully",
          review: existingReview,
        });
    }

    // Create a new review
    const newReview = await Review.create({
      user_id,
      business_id,
      rating,
      review,
    });
    res
      .status(201)
      .json({ message: "Review created successfully", review: newReview });
  } catch (error) {
    console.error("Error creating/updating review:", error.message);
    res.status(500).json({ message: "Failed to create/update review" });
  }
}

// Get Reviews for a Business
export async function getReviewsByBusiness(req, res) {
  try {
    const { business_id } = req.params;

    // Check if the business exists
    const business = await Business.findByPk(business_id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Fetch reviews and calculate average rating
    const reviews = await Review.findAll({
      where: { business_id },
      include: [{ model: User, attributes: ["id", "full_name"] }],
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    res.status(200).json({ business, averageRating, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
}

// Delete Review (optional)
export async function deleteReview(req, res) {
  try {
    const { review_id } = req.params;
    const user_id = req.user.id;

    // Find the review
    const review = await Review.findOne({ where: { id: review_id, user_id } });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Delete the review
    await review.destroy();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error.message);
    res.status(500).json({ message: "Failed to delete review" });
  }
}
