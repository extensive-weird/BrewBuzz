import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserBusinesses } from "../../api/businessApi";
import Header from "../../components/Header";
import { StyleSheet } from "react-native";

interface Business {
  id: string;
  name: string;
  location: string;
  description?: string;
  phone_number?: string;
  merchant_id?: string;
  clover_api_token?: string;
  cover_photo?: string;
}

const BusinessPage = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const parsed = storedUser ? JSON.parse(storedUser) : null;
        const userCategory = parsed?.user_category?.toLowerCase();

        if (userCategory !== "business") {
          Alert.alert(
            "Access Denied",
            "This page is for business owners only."
          );
          router.replace("/");
        }
      } catch (error) {
        console.error("Access check failed:", error);
        Alert.alert("Error", "Unable to verify access.");
        router.replace("/");
      } finally {
        setCheckingAccess(false);
      }
    };

    verifyAccess();
  }, []);

  useEffect(() => {
    if (!checkingAccess) {
      loadBusinesses();
    }
  }, [checkingAccess]);

  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const result = await fetchUserBusinesses();

      if (result.success && result.businesses) {
        if (result.businesses.length === 0) {
          router.replace("/business-profile");
          return;
        }

        setBusinesses(result.businesses);
      } else {
        Alert.alert("Error", result.message || "Failed to fetch businesses.");
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const renderBusinessCards = () => {
    return businesses.map((business) => (
      <TouchableOpacity
        key={business.id}
        style={styles.businessCard}
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: "/edit-business",
            params: { businessId: business.id },
          })
        }
      >
        <Image
          source={{
            uri: business.cover_photo
              ? business.cover_photo
              : Image.resolveAssetSource(
                  require("../../assets/default_business.jpg")
                ).uri,
          }}
          style={styles.cardImage}
          resizeMode="cover"
        />

        <View style={styles.gradientOverlay} />

        <View style={styles.textContainer}>
          <Text style={styles.businessName}>{business.name}</Text>
          <Text style={styles.businessLocation}>{business.location}</Text>
        </View>
      </TouchableOpacity>
    ));
  };

  if (checkingAccess || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C67C4E" />
        <Text style={styles.loadingText}>Loading businesses...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <Header title="My Businesses" />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 50 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsWrapper}>{renderBusinessCards()}</View>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.85}
          onPress={() => router.push("/business-registration")}
        >
          <Text style={styles.addButtonText}>+ Add Another Business</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default BusinessPage;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
  },
  cardsWrapper: {
    marginTop: 30,
    gap: 20,
  },
  businessCard: {
    height: 240,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  textContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  businessName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  businessLocation: {
    fontSize: 16,
    color: "#ffffff",
  },
  addButton: {
    marginTop: 30,
    backgroundColor: "#C67C4E",
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#C67C4E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#C67C4E",
  },
});
