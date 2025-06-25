import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.mjs";
import roleAuthorization from "../middleware/roleAuthMiddleware.mjs";
// Rewards Routes
import { saveBusinessRewards } from "../controllers/rewards/saveController.mjs";
import { getBusinessRewards } from "../controllers/rewards/getController.mjs";
import { getUserPoints } from "../controllers/userController.mjs";

const router = express.Router();

// Rewards Routes
router.get("/api/rewards/business", authenticateToken, getBusinessRewards);
router.post(
  "/api/rewards/business",
  authenticateToken,
  roleAuthorization(["Business"]),
  saveBusinessRewards
);

router.get("/api/points/:userId", authenticateToken, getUserPoints);

export default router;
