/**
 * axiosInstance.ts
 * 
 * Configures a reusable Axios instance for API requests.
 * 
 * Features:
 * - Uses `EXPO_PUBLIC_API_BASE_URL` from environment variables (.env file) as the base URL.
 * - Can be imported and used throughout the app for consistent request handling.
 * 
 * Export:
 * - `axiosInstance`: Pre-configured Axios object.
 */
import axios from 'axios';


// Create a reusable Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL, 
  

});

export default axiosInstance;