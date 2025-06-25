import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
  View,
  Text,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Button from "../components/Button";
import Header from "../components/Header";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/BusinessRegistrationStyles";
import { createBusiness } from "../api/businessApi";

export default function BusinessRegistrationPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [policyChecked, setPolicyChecked] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSelectPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant photo library permissions."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (result.canceled || !result.assets || !result.assets[0]) return;

    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      setCoverPhoto(manipResult);
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert("Error", "Failed to process the selected image.");
    }
  };

  const handleSubmit = async () => {
    if (!policyChecked) {
      Alert.alert("Error", "You must agree to the BrewBuzz policy to proceed.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", businessName);
    formData.append("location", businessLocation);
    formData.append("description", businessDescription);
    formData.append("phone_number", phoneNumber);
    formData.append("merchant_id", merchantId);
    formData.append("clover_api_token", apiToken);

    if (coverPhoto?.uri) {
      try {
        const filename = coverPhoto.uri.split("/").pop() || "cover_photo.jpg";
        const type = /\.(\w+)$/.exec(filename)?.[0]
          ? `image/${filename.split(".").pop()}`
          : "image/jpeg";

        formData.append("cover_photo", {
          uri: coverPhoto.uri,
          name: filename,
          type,
        } as any);
      } catch (error) {
        console.error("Error processing image upload:", error);
        Alert.alert("Error", "Failed to upload image.");
        setLoading(false);
        return;
      }
    }

    try {
      const result = await createBusiness(formData);
      if (result.success) {
        Alert.alert(
          "Success",
          result.message || "Business registered successfully!"
        );
        router.push("/(tabs)");
      } else {
        Alert.alert("Error", result.message || "Failed to register business.");
      }
    } catch (error: any) {
      console.error("Unexpected Error:", error);
      Alert.alert("Error", error.message || "Unexpected error occurred.");
    }

    setLoading(false);
  };

  const handleDeleteImage = () => {
    Alert.alert(
      "Remove Image",
      "Are you sure you want to remove this banner image?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: () => setCoverPhoto(null),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Register Business" showBackButton={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={handleSelectPhoto}
          >
            {coverPhoto ? (
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: coverPhoto.uri }}
                  style={styles.selectedImage}
                />
                <View style={styles.overlay}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteImage} // Clears the image when clicked
                  >
                    <MaterialIcons name="delete" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.imageWrapper}>
                <View style={styles.overlay}>
                  <Text style={styles.uploadText}>
                    Tap to upload cover photo
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.formContainer}>
            <FormField
              title="Business Name"
              value={businessName}
              onChangeText={setBusinessName}
            />
            <FormField
              title="Location"
              value={businessLocation}
              onChangeText={setBusinessLocation}
            />
            <FormField
              title="Description"
              value={businessDescription}
              onChangeText={setBusinessDescription}
              multiline
            />
            <FormField
              title="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <FormField
              title="Merchant ID"
              value={merchantId}
              onChangeText={setMerchantId}
            />
            <FormField
              title="API Token"
              value={apiToken}
              onChangeText={setApiToken}
            />

            <View style={styles.policyContainer}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  policyChecked && styles.checkboxChecked,
                ]}
                onPress={() => setPolicyChecked(!policyChecked)}
              >
                {policyChecked && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.policyText}>
                I agree to the{" "}
                <Text style={styles.policyLink}>BrewBuzz Policy</Text>.
              </Text>
            </View>

            <Button
              text="Submit"
              onPress={handleSubmit}
              style={styles.submitButton}
              loading={loading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const FormField = ({
  title,
  value,
  onChangeText,
  multiline = false,
  keyboardType = "default",
}: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{title}</Text>
    <TextInput
      style={[styles.input, multiline && styles.textArea]}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      keyboardType={keyboardType}
      blurOnSubmit
    />
  </View>
);
