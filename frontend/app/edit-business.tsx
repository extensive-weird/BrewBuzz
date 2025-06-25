/**
 * edit-business.tsx
 *
 * Business Edit Screen
 *
 * Allows business owners to update or delete their existing business profile.
 * Pre-populates data by fetching the business info via its ID and supports
 * image upload, conditional merchant/API token editing, and policy confirmation.
 *
 * Features:
 * - Loads existing business data using the `getBusinessById` API.
 * - Allows editing all business fields (name, location, description, phone).
 * - Offers image selection and resizing for a new cover photo.
 * - Requires policy agreement before submitting updates.
 * - Supports conditional editing for Merchant ID and API Token.
 * - Allows users to delete their business with confirmation prompt.
 *
 * Functions:
 * - fetchBusinessData: Fetches the business data by ID and sets form fields.
 * - handleSelectPhoto: Launches image picker, processes photo, and updates preview.
 * - handleUpdateBusiness: Validates fields, builds form data, and submits update request.
 * - handleDeleteBusiness: Confirms and deletes business, then redirects.
 * - handleFieldChangeConfirmation: Confirms before enabling edits to sensitive fields.
 *
 * Components Used:
 * - Header: Shared top bar with back navigation.
 * - Button: Reusable styled button component.
 * - View + KeyboardAvoidingView + ScrollView: Ensures smooth and accessible layout.
 *
 * Styles provided by `EditBusinessStyles.ts`.
 */
import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "../components/Button";
import {
  getBusinessById,
  updateBusiness,
  deleteBusiness,
} from "../api/businessApi";
import styles from "../styles/EditBusinessStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../components/Header";

export default function EditBusinessScreen() {
  const { businessId: businessIdParam } = useLocalSearchParams();
  const router = useRouter();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMerchantIdChanged, setIsMerchantIdChanged] = useState(false);
  const [isApiTokenChanged, setIsApiTokenChanged] = useState(false);
  const [policyChecked, setPolicyChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (businessIdParam) {
      setBusinessId(
        Array.isArray(businessIdParam) ? businessIdParam[0] : businessIdParam
      );
    }
  }, [businessIdParam]);

  useEffect(() => {
    if (businessId) {
      const fetchBusinessData = async () => {
        setLoading(true);
        try {
          const businessData = await getBusinessById(businessId);
          if (businessData.success && businessData.business) {
            const {
              name,
              location,
              description,
              phone_number,
              cover_photo,
              merchant_id,
              clover_api_token,
            } = businessData.business;
            setBusinessName(name || "");
            setBusinessLocation(location || "");
            setBusinessDescription(description || "");
            setPhoneNumber(phone_number || "");
            setCoverPhoto(cover_photo ? { uri: cover_photo } : null);
            setMerchantId(merchant_id || "");
            setApiToken(clover_api_token || "");
          } else {
            Alert.alert(
              "Error",
              businessData.message || "Failed to fetch business data."
            );
          }
        } catch (error) {
          console.error("Error fetching business data:", error);
          Alert.alert("Error", "An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      };
      fetchBusinessData();
    }
  }, [businessId]);

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

    if (!result.canceled && result.assets && result.assets[0]) {
      const { uri } = result.assets[0];
      try {
        const processedImage = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        setCoverPhoto(processedImage);
      } catch (error) {
        console.error("Error processing image:", error);
        Alert.alert("Error", "Failed to process image.");
      }
    }
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

  const handleUpdateBusiness = async () => {
    if (
      !businessName ||
      !businessLocation ||
      !businessDescription ||
      !phoneNumber
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (!policyChecked) {
      Alert.alert("Error", "Please agree to the BrewBuzz policy.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", businessName);
    formData.append("location", businessLocation);
    formData.append("description", businessDescription);
    formData.append("phone_number", phoneNumber);

    if (isMerchantIdChanged) formData.append("merchant_id", merchantId);
    if (isApiTokenChanged) formData.append("clover_api_token", apiToken);

    if (coverPhoto && coverPhoto.uri) {
      const localUri = coverPhoto.uri;
      const filename = localUri.split("/").pop() || "cover_photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("cover_photo", {
        uri: localUri,
        name: filename,
        type,
      } as any);
    }

    try {
      const updateResult = await updateBusiness(businessId!, formData);
      if (updateResult.success) {
        Alert.alert("Success", "Business updated successfully!");
        router.back();
      } else {
        Alert.alert(
          "Error",
          updateResult.message || "Failed to update business."
        );
      }
    } catch (error) {
      console.error("Error updating business:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBusiness = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this business? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const deleteResult = await deleteBusiness(businessId!);
              if (deleteResult.success) {
                Alert.alert("Deleted", "Business deleted successfully.");
                router.back();
              } else {
                Alert.alert(
                  "Error",
                  deleteResult.message || "Failed to delete business."
                );
              }
            } catch (error) {
              console.error("Error deleting business:", error);
              Alert.alert("Error", "An unexpected error occurred.");
            }
          },
        },
      ]
    );
  };

  const handleFieldChangeConfirmation = (field: "merchantId" | "apiToken") => {
    Alert.alert(
      "Confirm Change",
      `Are you sure you want to change your ${
        field === "merchantId" ? "Merchant ID" : "API Token"
      }?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            if (field === "merchantId") setIsMerchantIdChanged(true);
            else setIsApiTokenChanged(true);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Edit Business" showBackButton={true} />
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
                    onPress={handleDeleteImage}
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
              editable={isMerchantIdChanged}
              onPressField={() => handleFieldChangeConfirmation("merchantId")}
              specialField={!isMerchantIdChanged}
              specialText="Tap to change Merchant ID or leave as is"
            />

            <FormField
              title="API Token"
              value={apiToken}
              onChangeText={setApiToken}
              editable={isApiTokenChanged}
              onPressField={() => handleFieldChangeConfirmation("apiToken")}
              specialField={!isApiTokenChanged}
              specialText="Tap to change API Token or leave as is"
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
              onPress={handleUpdateBusiness}
              style={styles.submitButton}
              loading={isSubmitting}
            />

            <TouchableOpacity
              style={styles.deleteBusinessButton}
              onPress={handleDeleteBusiness}
            >
              <Text style={styles.deleteText}>Delete Business</Text>
            </TouchableOpacity>
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
  editable = true,
  onPressField,
  specialField = false,
  specialText = "",
}: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{title}</Text>
    {specialField ? (
      <TouchableOpacity onPress={onPressField}>
        <View style={styles.input}>
          <Text style={styles.specialFieldText}>{specialText}</Text>
        </View>
      </TouchableOpacity>
    ) : (
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        editable={editable}
        blurOnSubmit
      />
    )}
  </View>
);
