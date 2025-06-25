/**
 * Auth Middleware: JWT Verification
 * ---------------------------------
 * Verifies JWT from the Authorization header.
 * Attaches decoded user info to `req.user` if valid.
 * Responds with 401 if token is missing, 403 if invalid or expired.
 */

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer scheme

    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add the decoded user info to the request object
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
