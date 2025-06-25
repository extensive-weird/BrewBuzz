import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.mjs";
// Rewards Routes
import { createToken } from "../controllers/paymentController.mjs";

const router = express.Router();

// Rewards Routes
router.get("/create-token", authenticateToken, createToken);

router.post("/webhook", (req, res) => {
  const event = req.body;

  if (event.type === "charge.succeeded") {
    // Update order in your database or notify POS system
    console.log("Payment succeeded:", event.charge.id);
  }

  res.sendStatus(200);
});

export default router;
