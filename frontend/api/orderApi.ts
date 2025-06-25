import axiosInstance from '../service/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PlaceOrderResult {
  success: boolean;
  message?: string;
  order?: any;
  raw?: any; // Include raw Clover response for debugging
}

export const placeOrderApi = async (businessId: string, items: any[]): Promise<PlaceOrderResult> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      return { success: false, message: 'Authentication token is missing. Please log in again.' };
    }

    const response = await axiosInstance.post(
      '/api/orders',
      { business_id: businessId, items: items }, // Send the items array
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200) {
      return { success: true, order: response.data.order, message: response.data.message, raw: response.data.raw };
    }
    return { success: false, message: response.data.message || 'Failed to place order.', raw: response.data.raw };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || 'Unexpected error occurred.', raw: error.response?.data };
  }
};