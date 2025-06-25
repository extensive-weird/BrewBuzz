/**
 * businessIdService.ts
 * 
 * Business ID Management Service
 * 
 * This module provides functions for managing and tracking business IDs
 * throughout the application flow. It ensures that business IDs are properly
 * stored and retrieved when needed for cart operations and order placement.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Store the current business ID when browsing a business or placing an order
export const storeCurrentBusinessId = async (businessId: string): Promise<void> => {
  if (!businessId) {
    console.warn('Attempted to store empty business ID');
    return;
  }
  
  try {
    console.log(`Storing current business ID: ${businessId}`);
    await AsyncStorage.setItem('currentBusinessId', businessId);
  } catch (error) {
    console.error('Error storing current business ID:', error);
  }
};

// Get the current business ID
export const getCurrentBusinessId = async (): Promise<string | null> => {
  try {
    const businessId = await AsyncStorage.getItem('currentBusinessId');
    return businessId;
  } catch (error) {
    console.error('Error retrieving current business ID:', error);
    return null;
  }
};

// Clear the current business ID (e.g., when logging out)
export const clearCurrentBusinessId = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('currentBusinessId');
  } catch (error) {
    console.error('Error clearing current business ID:', error);
  }
};

// Helper function to validate and sanitize business IDs
export const validateBusinessId = (businessId: string | null | undefined): string | null => {
  if (!businessId || typeof businessId !== 'string' || businessId.trim() === '') {
    return null;
  }
  return businessId.trim();
};

// Helper function for debugging business ID issues
export const debugBusinessId = async (context: string): Promise<void> => {
  try {
    const businessId = await getCurrentBusinessId();
    console.log(`[${context}] Current business ID: ${businessId || 'Not set'}`);
  } catch (error) {
    console.error(`[${context}] Error debugging business ID:`, error);
  }
};
