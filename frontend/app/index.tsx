/**
 * index.tsx
 *
 * Welcome / Landing Screen
 *
 * This is the first screen users see when launching the app. It introduces
 * the brand with a visual and motivational message, and leads users to the login page.
 *
 * Features:
 * - Displays a coffee-themed welcome image and branding message.
 * - Includes a "Get started" button that navigates to the login screen.
 *
 * Functions:
 * - WelcomeScreen: Renders the visual layout and handles navigation to `/login`.
 *
 * Components Used:
 * - Button: Reusable button component used for navigation.
 * - Image, Text, View: Layout elements for styling the welcome experience.
 * - useRouter: Handles navigation via Expo Router.
 *
 * Styling handled via `WelcomeScreenStyles.ts`.
 */

import "expo-dev-client";

import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import styles from "../styles/WelcomeScreenStyles";
import Button from "../components/Button"; // Import the Button component
import { useRouter } from "expo-router"; // Import useRouter

import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function WelcomeScreen() {
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Section: Coffee Image */}
      <View style={styles.topSection}>
        <Image
          source={require("../assets/coffee.jpg")} // Replace with your image
          style={styles.image}
        />
      </View>

      {/* Bottom Section: Content */}
      <View style={styles.bottomSection}>
        {/* Title */}
        <Text style={styles.title}>
          Enjoy your <Text style={styles.highlight}>coffee</Text>
          {"\n"}
          before your activity
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Boost your productivity{"\n"}
          and build your mood!{"\n"}
          {"\n"}
        </Text>

        {/* Get Started Button */}
        <Button
          text="Get started"
          onPress={() => router.push("/login")} // Use router.push
        />
      </View>
    </View>
  );
}
