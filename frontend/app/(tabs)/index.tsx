import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchHomePageData, Business } from "../../api/homepageApi";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";
import {
  fetchFavoritesFromApi,
  toggleFavoriteStatus,
} from "../../api/favoritesApi";
import BusinessCard from "../../components/BusinessCard";

import styles from "../../styles/HomePageStyles";

export default function HomePage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userCategory, setUserCategory] = useState("");

  // Use useMemo to filter businesses based on search query
  const filteredBusinesses = useMemo(() => {
    if (!searchQuery.trim()) return businesses;

    return businesses.filter(
      (business) =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [businesses, searchQuery]);

  const fetchFavorites = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        await AsyncStorage.removeItem("authToken");
        router.replace("/login");
        return;
      }

      const favorites = await fetchFavoritesFromApi();
      setFavorites(new Set(favorites.map((b: { id: string }) => b.id) || []));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        await AsyncStorage.removeItem("authToken");
        router.replace("/login");
      }
      console.error("Error fetching favorites:", error);
    }
  }, [router]);

  const loadUserData = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserName(parsedUser.full_name || "Guest");
        setUserCategory(parsedUser.user_category);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const businessResult = await fetchHomePageData();
      await loadUserData();

      if (businessResult.success) {
        setBusinesses(businessResult.coffeeShops || []);
      }

      await fetchFavorites();
    } catch (error) {
      Alert.alert("Error", "Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [fetchFavorites, loadUserData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  useEffect(() => {
    if (params.refresh) {
      loadData();
    }
  }, [params.refresh, loadData]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFavoriteToggle = async (businessId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Session Expired", "Please log in again.");
        router.replace("/login");
        return;
      }

      await toggleFavoriteStatus(businessId);

      setFavorites((prev) => {
        const updated = new Set(prev);
        updated.has(businessId)
          ? updated.delete(businessId)
          : updated.add(businessId);
        return updated;
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Failed to update favorite status.");
    }
  };

  const navigateToMenu = useCallback(
    (business: Business) => {
      router.push({
        pathname: "/menu",
        params: {
          shopId: business.id,
          shopName: business.name,
          previousScreen: "Home",
        },
      });
    },
    [router]
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Image
          source={require("../../assets/search.png")}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search coffee"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C67C4E" />
          <Text style={styles.loadingText}>Loading businesses...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.businessList, { paddingBottom: 80 }]}
        >
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => (
              <BusinessCard
                business={business}
                key={business.id}
                navigateToMenu={navigateToMenu}
                handleFavoriteToggle={handleFavoriteToggle}
                favorites={favorites}
                userCategory={userCategory}
              />
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No coffee shops found matching "{searchQuery}"
              </Text>
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery("")}
              >
                <Text style={styles.clearSearchButtonText}>Clear Search</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
