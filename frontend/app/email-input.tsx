/**
 * email-input.tsx
 *
 * Forgot Password - Email Input Screen
 *
 * This screen is the first step in the password reset process. Users input
 * their email address to request a reset PIN that is emailed to them.
 *
 * Features:
 * - Validates user input and email format.
 * - Sends a request to the backend to generate a password reset PIN.
 * - On success, navigates to the PIN verification screen with email and token.
 * - Provides navigation options to sign in or create an account.
 *
 * Functions:
 * - validateEmail: Checks for proper email formatting using a regex.
 * - handleRequestPin: Validates input, sends PIN request, handles success and error alerts.
 *
 * Components Used:
 * - TextInput: Captures email address.
 * - Button: Reusable action button to submit the request.
 * - TouchableOpacity: Used for navigational links and actions.
 *
 * Styling is provided by `EmailInputStyles.ts`.
 */
import React, { useState } from "react";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { requestPin } from "../api/forgotPasswordApi";
import axios from "axios";
import styles from "../styles/EmailInputStyles";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";

export default function EmailInputScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRequestPin = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const data = await requestPin(email);
      Alert.alert("PIN Request", data.message, [
        {
          text: "OK",
          onPress: () =>
            router.push({
              pathname: "/pin-verification",
              params: { email, token: data.token },
            }),
        },
      ]);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          Alert.alert(
            "Error",
            "Email not found. Please enter a registered email."
          );
        } else {
          Alert.alert(
            "Error",
            error.response?.data?.message ||
              "Server error. Please try again later."
          );
        }
      } else {
        Alert.alert("Error", "Failed to request PIN. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
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
              <Text style={styles.headerText}>Reset Password</Text>
              <Text style={styles.subHeaderText}>
                Enter your email to receive a PIN code
              </Text>
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
                  placeholder="Enter email"
                  style={styles.input}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor="#999"
                  value={email}
                />
              </View>

              <Button
                text="Send PIN Code"
                onPress={handleRequestPin}
                loading={loading}
                style={styles.sendButton}
              />
            </View>

            <View style={styles.footerContainer}>
              <TouchableOpacity
                style={styles.backToSignInContainer}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.backToSignInText}>Back to sign in</Text>
              </TouchableOpacity>

              <View style={styles.createAccountContainer}>
                <Text style={styles.noAccountText}>
                  Don't have an account?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/create-account")}
                >
                  <Text style={styles.createAccountText}>Create one</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.privacyContainer}>
                <Text style={styles.privacyText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
