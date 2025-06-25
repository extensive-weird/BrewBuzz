import { StyleSheet } from "react-native";

// Color palette - centralized for easier theming
const COLORS = {
  primary: "#C67C4E",
  primaryDark: "#A86539",
  secondary: "#333333",
  background: "#F9F9F9",
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    light: "#EEEEEE",
    medium: "#DDDDDD",
    dark: "#777777",
  },
  star: "#FFD700",
  heart: "#E74C3C",
  shadow: "#000000",
  accent: "#F8E9D6", // New accent color for cards
  overlay: "rgba(0,0,0,0.03)", // Subtle overlay for depth
};

// Shadow styles - reusable across components
const createShadow = (elevation = 2) => ({
  shadowColor: COLORS.shadow,
  shadowOffset: { width: 0, height: elevation },
  shadowOpacity: elevation * 0.05,
  shadowRadius: elevation * 2,
  elevation: elevation,
});

const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: "100%",
  },

  content: {
    flex: 1,
  },

  // Enhanced header with gradient-like effect
  header: {
    backgroundColor: COLORS.black,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 140,
    paddingTop: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.primary,
    ...createShadow(5),
  },

  headerLeft: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerMiddle: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  headerRight: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  welcomeText: {
    marginTop: 30,
    fontSize: 18,
    color: COLORS.white,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  userName: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 4,
    letterSpacing: 0.7,
  },

  headerIcon: {
    width: 30,
    height: 30,
    tintColor: COLORS.gray.dark,
  },

  // Modernized search bar
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.gray.medium,
    ...createShadow(3),
  },

  searchIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
    tintColor: COLORS.primary,
  },

  searchInput: {
    flex: 1,
    fontSize: 18,
    color: COLORS.secondary,
    fontWeight: "500",
  },

  // Business listing section
  businessList: {
    paddingTop: 25,
    paddingHorizontal: 20,
  },

  businessCardInner: {
    backgroundColor: COLORS.overlay,
    borderRadius: 24,
  },

  // Rating section with improved layout
  starRatingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray.light,
    justifyContent: "space-between", // Better spacing
  },

  ratingLeftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  starRatings: {
    flexDirection: "row",
  },

  star: {
    color: COLORS.star,
    marginRight: 3,
    fontSize: 18,
  },

  starInactive: {
    color: COLORS.gray.medium,
    marginRight: 3,
    fontSize: 18,
  },

  averageRatingText: {
    fontSize: 16,
    color: COLORS.secondary,
    marginLeft: 10,
    fontWeight: "600",
  },

  // Favorite button with animation-ready styling
  favoriteButton: {
    position: "absolute",
    top: 18,
    right: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 12, // Slightly larger
    borderRadius: 30, // More rounded
    ...createShadow(6), // Stronger shadow
    borderWidth: 0, // Removed border
    zIndex: 10, // Ensure it's above other elements
  },

  // Loading state
  loadingContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: "500",
    letterSpacing: 0.5,
  },

  // New styles for additional features
  sectionTitle: {
    fontSize: 22, // Slightly larger
    fontWeight: "bold",
    color: COLORS.secondary,
    marginVertical: 18, // More space
    marginHorizontal: 20,
    letterSpacing: 0.5,
  },

  badge: {
    position: "absolute",
    top: 18,
    left: 18,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    ...createShadow(5),
    zIndex: 10, // Ensure it's above other elements
  },

  badgeText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 13, // Slightly larger
  },

  reviewCount: {
    fontSize: 14,
    color: COLORS.gray.dark,
    marginLeft: 5,
  },

  // New card accent elements
  cardAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 6,
    height: "40%",
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 3,
    borderBottomLeftRadius: 24,
  },

  // Distance pill
  distancePill: {
    position: "absolute",
    bottom: 18,
    right: 18,
    backgroundColor: "rgba(198, 124, 78, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  distanceText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 40,
  },

  noResultsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },

  clearSearchButton: {
    backgroundColor: "#C67C4E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },

  clearSearchButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default styles;
