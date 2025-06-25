/**
 * Shared Routes
 * -------------
 * Defines protected routes accessible by authenticated users based on roles.
 *
 * Includes:
 * - Homepage, Favorites, Cart, and Profile (Customer & Business)
 * - Business-specific routes (Business only)
 * - Review and Favorite routes
 *
 * Notes:
 * - Uses role-based middleware for access control
 * - All routes require authentication
 * - Used for testing purposes
 */

import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.mjs";
import roleAuthorization from "../middleware/roleAuthMiddleware.mjs";
import businessRoutes from "./businessRoutes.mjs";
import favoriteRoutes from "./favoriteRoutes.mjs";
import { getFavorites } from "../controllers/favoriteController.mjs";
import { getHomepage } from "../controllers/homepageController.mjs";
import reviewRoutes from "./reviewRoutes.mjs";

const router = express.Router();

// Route: Homepage (Shared for Customers and Businesses)
router.get(
  "/api/homepage",
  authenticateToken,
  roleAuthorization(["Customer", "Business"]), // Both roles allowed
  getHomepage // Use homepage controller
);

// Route: Shared Favorites
router.get(
  "/api/favorites",
  authenticateToken,
  roleAuthorization(["Customer", "Business"]), // Both roles allowed
  getFavorites // Use the controller function directly
);

// Route: Shared Cart
router.get(
  "/api/shared/cart",
  authenticateToken,
  roleAuthorization(["Customer", "Business"]), // Both roles allowed
  (req, res) => {
    res.status(200).json({
      message: "Cart",
      user: req.user,
    });
  }
);

// Route: Shared Profile
router.get(
  "/api/shared/profile",
  authenticateToken,
  roleAuthorization(["Customer", "Business"]), // Both roles allowed
  (req, res) => {
    res.status(200).json({
      message: "Profile page",
      user: req.user,
    });
  }
);

// Route: Business Page (Only for Business Role)
router.get(
  "/api/business/page",
  authenticateToken,
  roleAuthorization(["Business"]), // Only Businesses allowed
  (req, res) => {
    res.status(200).json({
      message: "Business Page",
      user: req.user,
    });
  }
);

router.use("/api", authenticateToken, reviewRoutes);

router.use(
  "/api/business",
  authenticateToken,
  roleAuthorization(["Business"]),
  businessRoutes
);

router.use(favoriteRoutes);

export default router;
