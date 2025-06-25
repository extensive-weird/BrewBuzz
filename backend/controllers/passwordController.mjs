/**
 * Password Reset Controller
 * -------------------------
 * Handles the PIN-based password reset process for users.
 *
 * - forgotPassword: Sends a 4-digit PIN to the user's email with a token.
 * - resetPassword: Verifies the PIN and token, then updates the user's password.
 *
 * Notes:
 * - PINs are time-limited via token expiration.
 * - Passwords are securely hashed before being stored.
 */

import bcrypt from "bcrypt";
import User from "../models/User.mjs";
import {
  generatePin,
  sendResetPin,
  generatePinToken,
  verifyPinToken,
} from "../services/passwordService.mjs";

// Forgot Password: Request PIN
export async function forgotPassword(req, res) {
  console.log("Received forgotPassword request with email:", req.body.email);

  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const pin = generatePin();
    const token = generatePinToken(user.id, pin);

    await sendResetPin(email, pin);

    res.status(200).json({
      message: "A 4-digit PIN has been sent to your email.",
      token, // Return token to the client to include in the reset password request
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error.message);
    res.status(500).json({ message: `An error occurred: ${error.message}` });
  }
}

// Reset Password: Verify PIN and Update Password
export async function resetPassword(req, res) {
  try {
    const { token, pin, newPassword } = req.body;

    const decoded = verifyPinToken(token);

    if (decoded.pin !== pin) {
      return res.status(400).json({ message: "Invalid PIN." });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error in resetPassword:", error.message);
    res.status(500).json({ message: `An error occurred: ${error.message}` });
  }
}
