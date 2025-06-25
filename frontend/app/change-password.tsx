/**
 * change-password.tsx
 *
 * Password Update Screen
 *
 * Allows logged-in users to change their account password by entering their
 * current password, new password, and confirming the new one.
 *
 * Features:
 * - Toggles visibility for password fields using eye icons.
 * - Disables input while the request is in progress.
 * - Calls the `changePassword` API and shows success or error messages.
 * - Redirects to the profile screen upon successful password change.
 *
 * Functions:
 * - handlePasswordChange: Sends old and new password to the backend,
 *   handles success/error alerts, and redirects on success.
 *
 * Components Used:
 * - Header: Shared top bar with optional back navigation.
 * - Button: Reusable submit button component.
 * - SafeAreaView: Ensures safe layout margins.
 * - Pressable + TextInput: Interactive password field controls.
 *
 * Styling handled via `ChangePasswordStyles.ts`.
 */
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { changePassword } from "../api/changePasswordApi";
import styles from "../styles/ChangePasswordStyles";
import Button from "../components/Button";
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const validatePasswords = () => {
    if (!oldPassword.trim()) {
      Alert.alert("Error", "Please enter your current password");
      return false;
    }

    if (!newPassword.trim()) {
      Alert.alert("Error", "Please enter a new password");
      return false;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "New passwords do not match");
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handlePasswordChange = async () => {
    if (!validatePasswords()) return;

    try {
      setIsLoading(true);
      const result = await changePassword(
        oldPassword,
        newPassword,
        confirmNewPassword
      );

      if (result.success) {
        Alert.alert("Success", "Password changed successfully!", [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)/user-profile"),
          },
        ]);
      } else {
        Alert.alert("Error", result.message || "Failed to change password");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
      console.error("Password change error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <Header
        title="Change Password"
        showBackButton={true}
        onBack={() => router.push("/(tabs)/user-profile")}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.instructionText}>
              Enter your current password and create a new one to update your
              account security.
            </Text>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Current Password"
                  secureTextEntry={!isOldPasswordVisible}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                  placeholderTextColor="#999"
                />
                <Pressable
                  onPress={() => setIsOldPasswordVisible(!isOldPasswordVisible)}
                  style={styles.eyeIconContainer}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={
                      isOldPasswordVisible ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="#666"
                  />
                </Pressable>
              </View>

              <View style={styles.divider} />

              <View style={styles.inputContainer}>
                <Ionicons
                  name="key-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  secureTextEntry={!isNewPasswordVisible}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                  placeholderTextColor="#999"
                />
                <Pressable
                  onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                  style={styles.eyeIconContainer}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={
                      isNewPasswordVisible ? "eye-off-outline" : "eye-outline"
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
                  placeholder="Confirm New Password"
                  secureTextEntry={!isConfirmPasswordVisible}
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                  placeholderTextColor="#999"
                />
                <Pressable
                  onPress={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                  style={styles.eyeIconContainer}
                  disabled={isLoading}
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
            </View>

            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>
                Password Requirements:
              </Text>
              <View style={styles.requirementItem}>
                <Ionicons
                  name={
                    newPassword.length >= 6
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={16}
                  color={newPassword.length >= 6 ? "#4CAF50" : "#666"}
                />
                <Text style={styles.requirementText}>
                  At least 6 characters long
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons
                  name={
                    newPassword === confirmNewPassword && newPassword.length > 0
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={16}
                  color={
                    newPassword === confirmNewPassword && newPassword.length > 0
                      ? "#4CAF50"
                      : "#666"
                  }
                />
                <Text style={styles.requirementText}>Passwords match</Text>
              </View>
            </View>

            <Button
              text="Update Password"
              onPress={handlePasswordChange}
              loading={isLoading}
              style={styles.updateButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
