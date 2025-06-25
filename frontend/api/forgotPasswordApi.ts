/**
 * forgotPasswordApi.ts
 * 
 * Forgot Password API
 * 
 * This module provides helper functions to handle the password reset workflow,
 * including requesting a PIN and submitting a new password.
 * 
 * Functions:
 * - requestPin: Sends a request to the backend to generate a password reset PIN
 *   for the given email. Returns a token and message from the server.
 * 
 * - resetPassword: Submits the token, PIN, and new password to complete the reset
 *   process. Handles token expiration gracefully and returns the final result.
 * 
 * Includes basic error handling to support user-friendly password recovery.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../service/axiosInstance';
import axios from 'axios';


export interface ForgotPasswordResult {
    success: boolean;
    message?:string;
}

export const requestPin = async (email: string) => {
    try {
        const response = await axiosInstance.post('/api/forgot-password', { email });
        return response.data; // we will get message and token
    } catch (error) {
        // Simply throw the error without logging it
        throw error;
    }
};

    export async function resetPassword(token: string, pin: string | number, newPassword: string) {
  
        try {
            const response = await axiosInstance.post('/api/reset-password', {
                token,
                pin,
                newPassword
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message?.includes('expired')) {
                // If token expired, guide user to restart the process
                throw new Error('Your reset link has expired. Please request a new PIN.');
            }
            throw new Error(error.response?.data?.message || 'Failed to reset password');
        }
    };










