/**
 * Password Reset Utility - PIN-Based Verification
 * -----------------------------------------------
 * This module provides functionality to handle PIN-based password reset flow for users.
 * It integrates email sending via Nodemailer and secure PIN verification using JWT.
 *
 * Features:
 * - generatePin(): Generates a random 4-digit PIN code
 * - sendResetPin(email, pin): Sends the PIN to the user's email address using a styled HTML email
 * - generatePinToken(userId, pin): Stores the PIN and user ID in a JWT token (expires in 15 minutes)
 * - verifyPinToken(token): Verifies and decodes the JWT token to validate the PIN
 *
 * Configuration:
 * - Requires environment variables:
 *   • EMAIL: Gmail address used to send the PIN
 *   • EMAIL_PASSWORD: Password or app-specific password for the Gmail account
 *   • JWT_SECRET: Secret key for signing and verifying tokens
 *
 * Usage:
 * 1. Generate a 4-digit PIN using generatePin().
 * 2. Send it via email with sendResetPin().
 * 3. Store the PIN in a token using generatePinToken().
 * 4. Verify the token with verifyPinToken() during validation.
 *
 * Security Notes:
 * - PIN is sent securely over email and stored only temporarily in a signed token.
 * - Tokens expire in 15 minutes to ensure short-term validity and reduce risk.
 */

import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.mjs";

// Generate a 4-digit PIN
export function generatePin() {
    return Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
}

// Send PIN via email
export async function sendResetPin(email, pin) {
    try {
        // Fetch user details based on the email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error("User not found."); // Handle the case when the user is not found
        }

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "☕️ BrewBuzz Password Reset PIN",
            html: `
                <p>Hello ${user.full_name}, <br /> 
                    You have requested a Reset PIN.</p>
                <p>
                    Enter your four-digit PIN to verify it's you:<br />
                    <strong>${pin}</strong>
                </p>
                <p>
                    If you did not request this, we recommend you change your BrewBuzz password and contact us.
                </p>
                <p>Thanks for helping us keep your account secure.<br />
                The BrewBuzz Team</p>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending reset PIN:", error.message);
        throw new Error("Failed to send reset PIN. Please try again later.");
    }
}

// Store PIN in a JWT for verification
export function generatePinToken(userId, pin) {
    return jwt.sign({ id: userId, pin }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

// Verify the PIN token
export function verifyPinToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error("Invalid or expired token.");
    }
}
