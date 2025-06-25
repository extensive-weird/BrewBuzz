// Handle routes for Order Processing 
import express from "express";
import { placeOrder } from "../controllers/orderController.mjs";
import { authenticateToken } from "../middleware/authMiddleware.mjs";

const router = express.Router();

// Place an order for items in the cart
router.post("/api/orders", authenticateToken, placeOrder);

export default router;
