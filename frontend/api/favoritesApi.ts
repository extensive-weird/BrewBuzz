/**
 * favoritesApi.ts
 * 
 * Favorites API
 * 
 * This module provides functions to manage a user's favorite businesses within the app.
 * All functions utilize the stored JWT token from AsyncStorage for secure API access.
 * 
 * Functions:
 * - fetchFavoritesFromApi: Retrieves the list of businesses marked as favorites by
 *   the logged-in user. Throws an error if the request fails.
 * 
 * - toggleFavoriteStatus: Sends a request to either add or remove a business from
 *   the user's favorites list, depending on its current state.
 * 
 * These utilities are designed to support real-time UI updates and user personalization.
 */
import axiosInstance from '../service/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchFavoritesFromApi = async () => {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token not found');

  const response = await axiosInstance.get('/api/favorites', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 200 && response.data.favorites) {
    return response.data.favorites;
  } else {
    throw new Error('Failed to load favorites.');
  }
};

export const toggleFavoriteStatus = async (businessId: string) => {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) throw new Error('Authentication token not found');

  await axiosInstance.post(`/api/favorites/${businessId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
