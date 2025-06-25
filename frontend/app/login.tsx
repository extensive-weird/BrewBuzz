/**
 * login.tsx
 *
 * Login Screen
 *
 * Provides user authentication for the BrewBuzz app. Users can enter their
 * email and password to sign in, with options to reset their password or create a new account.
 *
 * Features:
 * - Email and password input fields with basic validation.
 * - Password visibility toggle.
 * - Error handling and user feedback via alerts.
 * - Navigation to registration and password recovery screens.
 *
 * Functions:
 * - onLogin: Normalizes the email, calls the login API, and navigates to the home tab on success.
 *
 * Components Used:
 * - Button: Custom reusable button for the login action.
 * - useRouter: Handles navigation to other routes (signup, reset).
 * - TextInput, TouchableOpacity, Pressable: Build out the login form and interactivity.
 *
 * Styling handled via `LoginScreenStyles.ts`.
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { handleLogin, LoginResult } from "../api/authApi";
import Button from "../components/Button";
import { registerForPushNotificationsAsync } from "../service/pushNotificationService";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/LoginScreenStyles";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("amohsin@umich.edu");
  const [password, setPassword] = useState("Test4now!!!");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Missing Information",
        "Please enter both email and password"
      );
      return;
    }

    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const token = await registerForPushNotificationsAsync();

    const result: LoginResult = await handleLogin(
      normalizedEmail,
      password,
      token
    );

    if (result.success) {
      // Navigate to home tab
      router.replace("/(tabs)");
    } else {
      Alert.alert(
        "Login Error",
        result.message || "Unknown error occurred. Please try again.",
        [{ text: "OK" }],
        { cancelable: true }
      );
    }
    setLoading(false);
  };

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.welcomeText}>Welcome to BrewBuzz</Text>
              <Text style={styles.subtitleText}>Sign in to continue</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#999"
                />
                <Pressable
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  style={styles.eyeIconContainer}
                >
                  <Ionicons
                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#666"
                  />
                </Pressable>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/email-input")}
                style={styles.forgotPasswordContainer}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                text="Sign In"
                onPress={onLogin}
                loading={loading}
                style={styles.signInButton}
              />
            </View>

            <View style={styles.footerContainer}>
              <View style={styles.signupContainer}>
                <Text style={styles.noAccountText}>
                  Don't have an account?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/create-account")}
                >
                  <Text style={styles.createAccountText}>Create one</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.privacyContainer}
                onPress={() => router.push("./privacy-terms")}
              >
                <Text style={styles.privacyText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
