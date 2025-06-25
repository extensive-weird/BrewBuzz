/**
 * authApi.ts
 *
 * Authorization API
 *
 * This module provides authentication-related functions for the frontend:
 *
 * - handleLogin: Sends email and password to the backend API. On success, stores
 *   the JWT token and user information in AsyncStorage for persistent login.
 *
 * - handleCreateAccount: Sends user registration data to the backend to create a
 *   new user account. Handles different user roles (Customer, Business, Admin) and
 *   returns the API response along with any messages or errors.
 *
 * Also includes TypeScript interfaces (LoginResult, CreateAccountResult) to
 * ensure consistent response handling.
 */

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../service/axiosInstance";

// Define the type for the login result
export interface LoginResult {
  success: boolean;
  token?: string;
  user?: object;
  message?: string;
}
export interface CreateAccountResult {
  success: boolean;
  message?: string;
  token?: string;
  user?: object; // Adjust to your user object shape
}

// Define the async function for handling login logic
export const handleLogin = async (
  email: string,
  password: string,
  token: string
): Promise<LoginResult> => {
  try {
    const response = await axiosInstance.post("api/signin", {
      // Replace with your IP address
      email,
      password,
      token,
    });

    if (response.status === 200) {
      const { token, user } = response.data;

      // Save token securely
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      return { success: true, token, user };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Unknown error occurred.";
      return { success: false, message };
    }
    return { success: false, message: "Unexpected error occurred." };
  }

  // Default return for unhandled paths
  return { success: false, message: "Unhandled case in login process." };
};
export const handleCreateAccount = async (
  fullName: string,
  email: string,
  password: string,
  state: string,
  zipcode: string,
  userCategory: "Customer" | "Business" | "Admin",
  token: string
): Promise<CreateAccountResult> => {
  try {
    const response = await axiosInstance.post("/api/signup", {
      full_name: fullName,
      email,
      password,
      state,
      zipcode,
      user_category: userCategory,
      pushToken: token,
    });

    if (response.status === 201) {
      const { message, token, user } = response.data;
      return { success: true, message, token, user };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Unknown error occurred.";
      return { success: false, message };
    }
    return { success: false, message: "Unexpected error occurred." };
  }

  return {
    success: false,
    message: "Unhandled case in create account process.",
  };
};
