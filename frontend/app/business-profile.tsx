/**
 * business-profile.tsx
 *
 * Business Onboarding Splash Screen
 *
 * This screen introduces business users to the benefits of registering on BrewBuzz.
 * It's used as a first step before filling out the business registration form.
 *
 * Features:
 * - Displays a visual splash with a motivational message.
 * - Includes a "Get Started" button linking to the business registration screen.
 * - Offers a back button to return to the previous screen.
 *
 * Functions:
 * - BusinessProfileScreen: Renders the splash screen UI and handles back navigation.
 *
 * Components Used:
 * - Header: Shared component with title and back button.
 * - Link (Expo Router): Navigates to `/business-registration`.
 * - SafeAreaView: Ensures layout is safely displayed on all devices.
 *
 * Note: The component name should match the file for clarity.
 */

import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/Header";
import styles from "../styles/BusinessSplashScreenStyles";

export default function BusinessSplashScreen() {
  const router = useRouter();

  const benefits = [
    {
      icon: "🔍",
      title: "Increased Visibility",
      description: "Get discovered by coffee enthusiasts in your area",
    },
    {
      icon: "📊",
      title: "Customer Insights",
      description: "Access valuable data about your customers' preferences",
    },
    {
      icon: "📱",
      title: "Mobile Ordering",
      description: "Enable seamless mobile ordering for your business",
    },
    {
      icon: "⭐",
      title: "Build Reputation",
      description: "Collect reviews and build your brand reputation",
    },
  ];

  return (
    <View style={styles.container}>
      <Header
        title="Join BrewBuzz"
        showBackButton={true}
        onBack={() => router.push("/(tabs)")}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/BusinessSplashImage.png")}
            style={styles.mainImage}
          />
        </View>

        <Text style={styles.titleText}>Grow Your Coffee Business</Text>

        <Text style={styles.subtitleText}>
          Join thousands of cafés and coffee shops already thriving on the
          BrewBuzz platform
        </Text>

        <View style={styles.benefitsContainer}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitCard}>
              <Text style={styles.benefitIcon}>{benefit.icon}</Text>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>
                  {benefit.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Link href="/business-registration" asChild>
          <TouchableOpacity style={styles.buttonContainer}>
            <LinearGradient
              colors={["#7D5A50", "#5E3023"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Link>

        <Text style={styles.footerText}>
          Free registration • Setup in minutes
        </Text>
      </ScrollView>
    </View>
  );
}
