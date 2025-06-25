import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
  Modal,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import styles from "../styles/CreateAccountScreenStyles";
import { handleCreateAccount } from "../api/authApi";
import { registerForPushNotificationsAsync } from "../service/pushNotificationService";
import { Ionicons } from "@expo/vector-icons";

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export default function CreateAccountScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isBusiness, setIsBusiness] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [isPolicyChecked, setIsPolicyChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }

    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return false;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Please enter a password");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    if (!selectedState) {
      Alert.alert("Error", "Please select a state");
      return false;
    }

    if (!zipcode.trim()) {
      Alert.alert("Error", "Please enter your zipcode");
      return false;
    }

    if (!isPolicyChecked) {
      Alert.alert(
        "Error",
        "You must agree to the policy before creating an account"
      );
      return false;
    }

    return true;
  };

  const onCreateAccount = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const userCategory = isBusiness ? "Business" : "Customer";
    const token = await registerForPushNotificationsAsync();

    if (!token) {
      Alert.alert("Error", "Push notification permission required");
      setLoading(false);
      return;
    }

    const result = await handleCreateAccount(
      fullName,
      email,
      password,
      selectedState,
      zipcode,
      userCategory,
      token
    );

    setLoading(false);

    if (result.success) {
      Alert.alert(
        "Success",
        result.message || "Account created successfully!",
        [
          {
            text: "OK",
            onPress: () => router.push("/login"),
          },
        ]
      );
    } else {
      Alert.alert("Error", result.message || "Unable to create account.");
    }
  };

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.headerText}>Create Account</Text>
            </View>

            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  !isBusiness && styles.activeToggle,
                ]}
                onPress={() => setIsBusiness(false)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    !isBusiness && styles.activeToggleText,
                  ]}
                >
                  Customer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, isBusiness && styles.activeToggle]}
                onPress={() => setIsBusiness(true)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    isBusiness && styles.activeToggleText,
                  ]}
                >
                  Business
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
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

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  secureTextEntry={!isConfirmPasswordVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
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

              <View style={styles.locationRow}>
                <Pressable
                  style={styles.stateContainer}
                  onPress={() => setModalVisible(true)}
                >
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <Text
                    style={[
                      styles.stateText,
                      selectedState
                        ? styles.selectedStateText
                        : styles.placeholderStateText,
                    ]}
                  >
                    {selectedState || "Select State"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </Pressable>

                <View style={styles.zipcodeContainer}>
                  <Ionicons
                    name="map-outline"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Zipcode"
                    value={zipcode}
                    onChangeText={setZipcode}
                    keyboardType="numeric"
                    maxLength={5}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              <View style={styles.policyContainer}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    isPolicyChecked && styles.checkboxChecked,
                  ]}
                  onPress={() => setIsPolicyChecked(!isPolicyChecked)}
                >
                  {isPolicyChecked && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
                <Text style={styles.policyText}>
                  I agree to the BrewBuzz{" "}
                  <Text style={styles.policyLink}>
                    {isBusiness ? "Business" : "Customer"} policy
                  </Text>
                  .
                </Text>
              </View>

              <TouchableOpacity
                style={styles.createButton}
                onPress={onCreateAccount}
                disabled={loading}
              >
                <Text style={styles.createButtonText}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text
                  style={styles.signInText}
                  onPress={() => router.push("/login")}
                >
                  Sign in
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select State</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.stateList}>
              {US_STATES.map((state) => (
                <TouchableOpacity
                  key={state}
                  style={[
                    styles.stateItem,
                    selectedState === state && styles.selectedStateItem,
                  ]}
                  onPress={() => {
                    setSelectedState(state);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.stateItemText,
                      selectedState === state && styles.selectedStateItemText,
                    ]}
                  >
                    {state}
                  </Text>
                  {selectedState === state && (
                    <Ionicons name="checkmark" size={20} color="#C67C4E" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
