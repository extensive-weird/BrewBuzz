/**
 * User Controller
 * ---------------
 * Handles user authentication and registration logic.
 *
 * - signUp: Creates a new user after validating input and hashing the password.
 * - signIn: Authenticates user credentials and returns a JWT token with user info.
 *
 * Notes:
 * - Includes role-based route suggestion in response
 * - Does not expose sensitive data like raw passwords
 */

import User from "../models/User.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
// Function to handle user signup
export async function signUp(req, res) {
  try {
    const {
      full_name,
      email,
      password,
      state,
      zipcode,
      user_category,
      pushToken,
    } = req.body;

    // Validate required fields
    if (
      !full_name ||
      !email ||
      !password ||
      !state ||
      !zipcode ||
      !user_category
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user category is valid
    if (!["Customer", "Business", "Admin"].includes(user_category)) {
      return res.status(400).json({ message: "Invalid user category" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
      state,
      zipcode,
      user_category,
      pushToken,
    });

    // Return success response
    res.status(201).json({
      message: "User created successfully",

      user: {
        id: newUser.id,
        email: newUser.email,
        user_category: newUser.user_category,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function signIn(req, res) {
  try {
    const { email, password, token: pushToken } = req.body;
    console.log("signIn function called", pushToken);

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate the password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update push token if provided
    if (pushToken) {
      await user.update({ pushToken });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        user_category: user.user_category,
        full_name: user.full_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Role-based redirection routes
    const roleRoutes = {
      Customer: "/api/homepage",
      Business: "/api/homepage",
    };

    res.status(200).json({
      message: `Welcome back, ${user.full_name}!`,
      token,
      user: {
        id: user.id,
        email: user.email,
        user_category: user.user_category,
        full_name: user.full_name,
      },
      redirectTo: roleRoutes[user.user_category] || null,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

export async function getAllCustomerPushTokens() {
  try {
    // Query the database for all customers
    const customers = await User.findAll({
      where: {
        user_category: "Customer",
        pushToken: {
          [Op.not]: null, // Only get customers with non-null push tokens
        },
      },
      attributes: ["pushToken"], // Only retrieve the pushToken field
    });

    // Extract push tokens and filter out duplicates
    const pushTokens = [
      ...new Set(
        customers.map((customer) => customer.pushToken).filter((token) => token) // Additional filter to remove any empty strings
      ),
    ];

    return pushTokens;
  } catch (error) {
    console.error("Error fetching customer push tokens:", error);
    throw error;
  }
}

export async function getUserPoints(req, res) {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findOne({ where: { id: userId } });

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's points
    return res.status(200).json({
      userId: user.id,
      points: user.points || 0,
      message: "User points retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving user points:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
