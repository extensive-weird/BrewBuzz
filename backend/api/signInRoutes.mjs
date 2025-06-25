//define routes for user Sign In


import express from "express";
import { signIn } from "../controllers/userController.mjs";


const router = express.Router();

// Login route
router.post("/api/signin", signIn);

export default router;
