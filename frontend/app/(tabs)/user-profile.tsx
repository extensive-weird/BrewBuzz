/**
 * user-profile.tsx
 *
 * Profile Screen
 *
 * Displays the logged-in user's name, email, and profile image, along with
 * options to change password, manage payment methods, settings, or sign out.
 *
 * Features:
 * - Loads user profile details from AsyncStorage on mount.
 * - Displays user name and email pulled from stored user session.
 * - Allows user to navigate to the Change Password screen.
 * - Provides access to app settings and preferences.
 * - Signs out the user and redirects to login after clearing session data.
 *
 * Functions:
 * - loadUserProfile: Retrieves and sets user data (name, email) from AsyncStorage.
 * - handleSignOut: Confirms and clears session data, then redirects to login screen.
 *
 * Components Used:
 * - Header: Shared top navigation component.
 * - SafeAreaView: Ensures layout safety across different devices.
 * - TouchableOpacity: Used for option selection (password change, sign out).
 *
 * Styling managed via `UserProfileScreenStyles.ts` with support for responsive units.
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Header from "../../components/Header";

export default function UserProfileScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userCategory, setUserCategory] = useState("");

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserName(parsedUser.full_name || "Guest");
          setUserEmail(parsedUser.email || "N/A");
          setUserCategory(parsedUser.user_category);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        Alert.alert("Error", "Failed to load profile data.");
      }
    };

    loadUserProfile();
  }, []);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            router.replace("/login");
          } catch (error) {
            console.error("Sign out error:", error);
            Alert.alert("Error", "Failed to sign out.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Profile" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require("../../assets/profileframe.png")}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editProfileButton}>
              <Ionicons name="camera" size={wp("5%")} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <View style={styles.emailContainer}>
              <Ionicons name="mail-outline" size={wp("4.5%")} color="#666" />
              <Text style={styles.emailText}>{userEmail}</Text>
            </View>
          </View>
        </View>
        {/* Stats Section */}
        {/* {userCategory === "Business" && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        )} */}

        {/* Options Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => router.push("/change-password")}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={wp("6%")}
                color="#5D4037"
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Change Password</Text>
              <Text style={styles.optionDescription}>
                Update your account password
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={wp("5%")} color="#BBBBBB" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionIconContainer}>
              <Ionicons name="card-outline" size={wp("6%")} color="#5D4037" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Payment Methods</Text>
              <Text style={styles.optionDescription}>
                Manage your payment options
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={wp("5%")} color="#BBBBBB" />
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>

          {/* <TouchableOpacity
            style={styles.optionItem}
            onPress={navigateToSettings}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons
                name="settings-outline"
                size={wp("6%")}
                color="#5D4037"
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>App Settings</Text>
              <Text style={styles.optionDescription}>
                Notifications, theme, language
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={wp("5%")} color="#BBBBBB" />
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => router.push("../privacy-terms")}
          >
            <View style={styles.optionIconContainer}>
              <MaterialIcons
                name="privacy-tip"
                size={wp("6%")}
                color="#5D4037"
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Privacy & Terms</Text>
              <Text style={styles.optionDescription}>
                Privacy policy and terms of service
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={wp("5%")} color="#BBBBBB" />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={wp("6%")} color="#FFFFFF" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>BrewBuzz v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollContent: {
    paddingBottom: hp("8%"),
  },
  profileHeader: {
    backgroundColor: "#FFFFFF",
    padding: wp("5%"),
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: wp("22%"),
    height: wp("22%"),
    borderRadius: wp("11%"),
    borderWidth: 3,
    borderColor: "#5D4037",
  },
  editProfileButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#5D4037",
    width: wp("8%"),
    height: wp("8%"),
    borderRadius: wp("4%"),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    marginLeft: wp("4%"),
    flex: 1,
  },
  profileName: {
    fontSize: wp("5.5%"),
    fontWeight: "bold",
    color: "#333333",
    marginBottom: hp("0.5%"),
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  emailText: {
    fontSize: wp("3.8%"),
    color: "#666666",
    marginLeft: wp("1%"),
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: hp("2%"),
    marginBottom: hp("2%"),
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#5D4037",
  },
  statLabel: {
    fontSize: wp("3.5%"),
    color: "#666666",
    marginTop: hp("0.5%"),
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#EEEEEE",
  },
  sectionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp("3%"),
    marginHorizontal: wp("4%"),
    marginVertical: hp("2%"),
    padding: wp("4%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "bold",
    color: "#333333",
    marginBottom: hp("1.5%"),
    paddingHorizontal: wp("2%"),
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp("1.5%"),
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  optionIconContainer: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    backgroundColor: "#F5F0EE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("3%"),
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#333333",
  },
  optionDescription: {
    fontSize: wp("3.2%"),
    color: "#888888",
    marginTop: hp("0.3%"),
  },
  signOutButton: {
    flexDirection: "row",
    backgroundColor: "#D32F2F",
    marginHorizontal: wp("4%"),
    marginTop: hp("2%"),
    paddingVertical: hp("1.8%"),
    borderRadius: wp("3%"),
    justifyContent: "center",
    alignItems: "center",
  },
  signOutText: {
    color: "#FFFFFF",
    fontSize: wp("4.5%"),
    fontWeight: "bold",
    marginLeft: wp("2%"),
  },
  versionText: {
    textAlign: "center",
    color: "#999999",
    fontSize: wp("3%"),
    marginTop: hp("2%"),
  },
});
