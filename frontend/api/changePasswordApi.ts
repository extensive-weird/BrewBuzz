/**
 * changePasswordApi.ts
 * 
 * Change Password API
 * 
 * This module provides the `changePassword` function to allow authenticated users
 * to update their account password securely.
 * 
 * - changePassword: Sends the old password, new password, and confirmation to the 
 *   backend API. Uses the stored JWT token from AsyncStorage for authorization.
 *   Returns a success status and message based on the server response.
 * 
 * - ChangePasswordResult: TypeScript interface defining the expected structure
 *   of the result returned by the change password request.
 * 
 * Ensures secure handling of credentials and communicates errors clearly
 * for frontend error display.
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../service/axiosInstance';


export interface ChangePasswordResult {
    success: boolean;
    message?: string;
}


export const changePassword = async (
    oldPassword: string,
    newPassword: string, 
    confirmNewPassword: string
    ): Promise<ChangePasswordResult> => {
    try{
        const token = await AsyncStorage.getItem('authToken');
        
        if (!token){
            return {success: false, message: 'Authentication token is missing. Please log in again.'};
        }

        const response = await axiosInstance.post('/api/change-password',
            {oldPassword, newPassword, confirmNewPassword},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );


        return {
            success: true,
             message: response.data.message
            };
        
    } catch (error: any) {
        return {
            success: false, 
            message: error.response?.data?.message || 'Unexpected error occured',
                };
    }



    };






