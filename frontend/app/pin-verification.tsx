/**
 *
 *
 * Password Reset – PIN Verification and New Password Entry
 *
 * This screen is used in the password recovery process. It guides the user through:
 * 1. Verifying a 4-digit PIN sent to their email.
 * 2. Setting a new password if the PIN is valid.
 *
 * Features:
 * - PIN input (auto-focus & auto-advance across 4 fields).
 * - Token decoding and PIN comparison for verification.
 * - Password validation and confirmation logic.
 * - Handles resend PIN and alerts on success/failure.
 * - Conditional rendering of the second screen after successful verification.
 *
 * Functions:
 * - handlePinChange: Updates a single digit of the PIN, advances focus, and verifies if complete.
 * - handleVerify: Decodes token and checks if user-entered PIN matches backend-issued one.
 * - handleResend: Resends PIN to the user's email via the API.
 * - handleResetPassword: Sends new password + PIN to the backend to complete password reset.
 * - validatePin / validatePassword: Validates input for required length and consistency.
 *
 * Components Used:
 * - TextInput: For PIN entry and password fields.
 * - Alert: Displays all user feedback.
 * - useRouter, useLocalSearchParams: Navigation and token/email passing from previous screen.
 *
 * Styling handled via `PINVerificationStyles.ts`.
 */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { resetPassword } from "../api/forgotPasswordApi";
import styles from "../styles/PINVerificationStyles";
import axiosInstance from "../service/axiosInstance";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";

export default function PINVerificationScreen() {
  const { email, token } = useLocalSearchParams();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = React.useRef<Array<TextInput | null>>([
    null,
    null,
    null,
    null,
  ]);

  const router = useRouter();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePinChange = (value: string, index: number) => {
    if (value.length <= 1) {
      setPin((prevPin) => {
        const newPin = [...prevPin];
        newPin[index] = value;
        if (value && index < 3) {
          inputRefs.current[index + 1]?.focus();
        }
        if (index === 3) {
          setTimeout(() => {
            const fullPin = newPin.join("");
            if (fullPin.length === 4) {
              handleVerify(fullPin);
            }
          }, 100);
        }
        return newPin;
      });
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setResendLoading(true);
    try {
      if (typeof email === "string") {
        const response = await axiosInstance.post("/api/forgot-password", {
          email,
        });
        Alert.alert("Success", "Verification code resent to your email");
        setCountdown(60); // Start 60 second countdown
      } else {
        Alert.alert("Error", "Invalid email format.");
      }
    } catch (error: unknown) {
      console.error("Resend Error:", error);
      let errorMessage = "Failed to resend verification code";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || "Server error";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const validatePin = () => {
    const fullPin = pin.join("");
    if (fullPin.length !== 4) {
      Alert.alert("Error", "Please enter the 4-digit verification code");
      return false;
    }
    return true;
  };

  const handleVerify = (enteredPin?: string) => {
    const fullPin = enteredPin || pin.join("");
    if (fullPin.length !== 4) {
      Alert.alert("Error", "Please enter a valid 4-digit PIN.");
      return;
    }

    setLoading(true);

    try {
      if (typeof token === "string") {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const storedPin = String(decodedToken.pin);

        setTimeout(() => {
          setLoading(false);
          if (fullPin === storedPin) {
            setVerificationComplete(true);
          } else {
            Alert.alert("Error", "Invalid PIN. Please try again.");
            setPin(["", "", "", ""]);
            inputRefs.current[0]?.focus();
          }
        }, 500);
      } else {
        setLoading(false);
        Alert.alert("Error", "Invalid token format");
      }
    } catch (error) {
      setLoading(false);
      console.error("❌ Error decoding token:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const validatePassword = () => {
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return false;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) return;
    const formattedPin = parseInt(pin.join(""), 10);
    setLoading(true);

    try {
      if (typeof token === "string") {
        const response = await resetPassword(token, formattedPin, newPassword);
        if (!response) throw new Error("Failed to reset password");
        Alert.alert("Success", "Your password has been reset successfully", [
          { text: "OK", onPress: () => router.push("/login") },
        ]);
      } else {
        Alert.alert("Error", "Invalid token format.");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to reset password");
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
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.title}>
                {verificationComplete
                  ? "Create New Password"
                  : "Verify Your Email"}
              </Text>

              {!verificationComplete && (
                <Text style={styles.subtitle}>
                  Enter the 4-digit code sent to{" "}
                  {typeof email === "string" ? email : ""}
                </Text>
              )}
            </View>

            {!verificationComplete ? (
              // PIN Verification Screen
              <View style={styles.formContainer}>
                <View style={styles.pinContainer}>
                  {pin.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      style={[
                        styles.pinInput,
                        digit ? styles.pinInputFilled : null,
                        loading ? styles.pinInputDisabled : null,
                      ]}
                      value={digit}
                      onChangeText={(value) => handlePinChange(value, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      autoFocus={index === 0}
                      editable={!loading}
                    />
                  ))}
                </View>

                {loading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#7C4DFF" />
                    <Text style={styles.loadingText}>Verifying code...</Text>
                  </View>
                )}

                <View style={styles.resendContainer}>
                  <Text style={styles.resendText}>Didn't receive a code?</Text>
                  <TouchableOpacity
                    onPress={handleResend}
                    disabled={resendLoading || countdown > 0}
                    style={styles.resendButton}
                  >
                    {resendLoading ? (
                      <ActivityIndicator size="small" color="#7C4DFF" />
                    ) : (
                      <Text
                        style={[
                          styles.resendLink,
                          countdown > 0 ? styles.resendLinkDisabled : null,
                        ]}
                      >
                        {countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // New Password Screen
              <View style={styles.formContainer}>
                <View style={styles.passwordContainer}>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!isPasswordVisible}
                      placeholder="New Password"
                      placeholderTextColor="#999"
                    />
                    <Pressable
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                      style={styles.eyeIconContainer}
                    >
                      <Ionicons
                        name={
                          isPasswordVisible ? "eye-off-outline" : "eye-outline"
                        }
                        size={20}
                        color="#666"
                      />
                    </Pressable>
                  </View>

                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!isConfirmPasswordVisible}
                      placeholder="Confirm New Password"
                      placeholderTextColor="#999"
                    />
                    <Pressable
                      onPress={() =>
                        setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                      }
                      style={styles.eyeIconContainer}
                    >
                      <Ionicons
                        name={
                          isConfirmPasswordVisible
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={20}
                        color="#666"
                      />
                    </Pressable>
                  </View>

                  <View style={styles.passwordRequirements}>
                    <Text style={styles.requirementsTitle}>
                      Password Requirements:
                    </Text>
                    <View style={styles.requirementItem}>
                      <Ionicons
                        name={
                          newPassword.length >= 8
                            ? "checkmark-circle"
                            : "ellipse-outline"
                        }
                        size={16}
                        color={newPassword.length >= 8 ? "#4CAF50" : "#666"}
                      />
                      <Text style={styles.requirementText}>
                        At least 8 characters long
                      </Text>
                    </View>
                    <View style={styles.requirementItem}>
                      <Ionicons
                        name={
                          newPassword === confirmPassword &&
                          newPassword.length > 0
                            ? "checkmark-circle"
                            : "ellipse-outline"
                        }
                        size={16}
                        color={
                          newPassword === confirmPassword &&
                          newPassword.length > 0
                            ? "#4CAF50"
                            : "#666"
                        }
                      />
                      <Text style={styles.requirementText}>
                        Passwords match
                      </Text>
                    </View>
                  </View>
                </View>

                <Button
                  text="Reset Password"
                  onPress={handleResetPassword}
                  loading={loading}
                  style={styles.resetButton}
                />
              </View>
            )}

            <View style={styles.footerContainer}>
              <TouchableOpacity
                style={styles.backToSignInContainer}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.backToSignInText}>Back to sign in</Text>
              </TouchableOpacity>

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
