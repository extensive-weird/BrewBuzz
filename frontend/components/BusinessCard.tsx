import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Business } from "../api/homepageApi";

type BusinessCardProps = {
  business: Business;
  navigateToMenu: (business: Business) => void;
  favorites: Set<string>;
  handleFavoriteToggle: (businessId: string) => void;
  userCategory: string;
};

const favoritesFilled = require("../assets/favorites-filled.png");
const favoritesOutline = require("../assets/favorites.png");
const defaultBusinessImage = Image.resolveAssetSource(
  require("../assets/default_business.jpg")
).uri;

const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  navigateToMenu,
  favorites,
  handleFavoriteToggle,
  userCategory,
}) => {
  return (
    <TouchableOpacity
      key={business.id}
      style={styles.businessCard}
      onPress={() => navigateToMenu(business)}
    >
      <View style={styles.cardHeader}>
        <Image
          source={{
            uri: business.cover_photo || defaultBusinessImage,
          }}
          style={styles.businessImage}
          resizeMode="cover"
        />
        {userCategory !== "Business" && (
          <TouchableOpacity
            onPress={() => handleFavoriteToggle(business.id)}
            style={styles.favoriteButtonOverlay}
          >
            <Image
              source={
                favorites.has(business.id) ? favoritesFilled : favoritesOutline
              }
              style={styles.favoriteIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.businessInfo}>
        <View style={styles.nameAndRating}>
          <Text style={styles.businessName}>{business.name}</Text>
          <View style={styles.ratingPill}>
            <Text style={styles.ratingText}>
              {business.averageRating.toFixed(1)} ★
            </Text>
          </View>
        </View>
        <Text style={styles.businessAddress}>{business.location}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  businessCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    borderColor: "#C67C4E",
    borderWidth: 2,
  },
  cardHeader: {
    position: "relative",
  },
  businessImage: {
    width: "100%",
    height: 180,
  },
  favoriteButtonOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 8,
  },
  favoriteIcon: {
    width: 24,
    height: 24,
  },
  businessInfo: {
    padding: 16,
  },
  nameAndRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    flex: 1,
  },
  ratingPill: {
    backgroundColor: "#C67C4E",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  businessAddress: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
});

export default BusinessCard;
