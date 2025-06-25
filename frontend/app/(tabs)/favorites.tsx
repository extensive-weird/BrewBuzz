/**
 * favorites.tsx
 *
 * Favorites List Screen
 *
 * This screen displays a list of businesses that the user has marked as favorites.
 * Users can view business details, navigate to their menu, or remove them from favorites.
 *
 * Features:
 * - Loads and displays user's favorite businesses from the backend.
 * - Allows removing a business from favorites with a toggle button.
 * - Navigates to the selected business's menu screen.
 * - Displays ratings visually using stars.
 *
 * Functions:
 * - loadFavorites: Fetches the user's favorite businesses from the API.
 * - handleFavoriteToggle: Removes a business from the list and updates backend.
 * - navigateToMenu: Navigates to the menu screen for a selected business.
 *
 * Hooks:
 * - useFocusEffect: Ensures favorites list refreshes when the screen gains focus.
 *
 * Components Used:
 * - Header: Reusable header component.
 * - ScrollView: Displays favorite businesses in a scrollable list.
 * - ActivityIndicator: Shows loading spinner while fetching data.
 *
 * Styles provided by `FavoritesPageStyles.ts`.
 */
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import {
  fetchFavoritesFromApi,
  toggleFavoriteStatus,
} from "../../api/favoritesApi";
import { useRouter, useFocusEffect } from "expo-router";
import Header from "../../components/Header";
import styles from "../../styles/FavoritesPageStyles";
import BusinessCard from "../../components/BusinessCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Business } from "../../api/homepageApi";

const FavoritesPage = () => {
  const [businessItem, setBusinessItems] = useState<Business[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [userCategory, setUserCategory] = useState("");

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFavoritesFromApi();
      setBusinessItems(data);
      setFavorites(new Set(data.map((b: { id: string }) => b.id) || []));
    } catch (error) {
      console.error("Error fetching favorites:", error);
      Alert.alert("Error", "Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUserData = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserCategory(parsedUser.user_category);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
      loadUserData();
    }, [loadFavorites, loadUserData])
  );

  const handleFavoriteToggle = async (businessId: string) => {
    try {
      await toggleFavoriteStatus(businessId);
      setBusinessItems((prevFavorites) =>
        prevFavorites.filter((business) => business.id !== businessId)
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Failed to update favorite status.");
    }
  };

  const navigateToMenu = (business: Business) => {
    router.push({
      pathname: "/menu",
      params: {
        shopId: business.id,
        shopName: business.name,
        previousScreen: "Favorites",
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="My Favorites" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C67C4E" />
          <Text style={styles.loadingText}>Loading businesses...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.businessList, { paddingBottom: 80 }]}
        >
          {businessItem.length > 0 ? (
            businessItem.map((item) => (
              <BusinessCard
                business={item}
                key={item.id}
                navigateToMenu={navigateToMenu}
                handleFavoriteToggle={handleFavoriteToggle}
                favorites={favorites}
                userCategory={userCategory}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Image
                source={require("../../assets/favorites-filled.png")}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyTitle}>No favorites yet!</Text>
              <Text style={styles.emptyText}>
                Start exploring coffee and tap the heart icon to add them to
                your favorites.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default FavoritesPage;
