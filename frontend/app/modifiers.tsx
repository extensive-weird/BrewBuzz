/**
 * modifiers.tsx
 *
 * Menu Item Customization Screen
 *
 * Allows users to customize a selected menu item with modifiers (e.g., size, milk type),
 * add special requests, and add the final item to their cart.
 *
 * Features:
 * - Displays modifier groups and options for a given menu item.
 * - Handles selection and deselection of modifier options per group.
 * - Provides a text input for additional user comments or requests.
 * - Calculates and displays total price dynamically based on selected modifiers.
 * - Saves customized item to AsyncStorage cart on confirmation.
 *
 * Functions:
 * - handleModifierSelection: Toggles a modifier option within its group.
 * - handleAddToCart: Builds the customized item and stores it in AsyncStorage.
 * - measurePosition: Measures Y-offset of the additional request input for scroll adjustment.
 *
 * Hooks:
 * - useEffect: Listens for keyboard show/hide events to auto-scroll to the input box.
 * - useLocalSearchParams: Extracts item, shopName, and shopAddress passed from the previous screen.
 *
 * Components Used:
 * - ScrollView + KeyboardAvoidingView: Ensures smooth keyboard interaction and layout.
 * - TouchableOpacity: For modifier selections and action buttons.
 * - AsyncStorage: Stores cart data locally.
 *
 * Styling handled via `ModifiersScreenStyles.ts`.
 */
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/ModifiersScreenStyles";
import Header from "../components/Header";
import { getCurrentBusinessId } from "../service/businessIdService";

type Modifier = { id: string; name: string; price: number };
type ModifierGroup = {
  groupId: string;
  groupName: string;
  options: Modifier[];
};
type MenuItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  modifiers: ModifierGroup[];
};

export default function ModifiersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    item: string;
    noModifiers?: string;
    shopName: string;
    shopAddress: string;
    shopId?: string;  // Add this parameter
  }>();

  const item = JSON.parse(params.item) as MenuItem;
  const noModifiers = params.noModifiers === "true";
  const { shopName, shopAddress } = params;

  const [selectedModifiers, setSelectedModifiers] = useState<{
    [key: string]: Modifier[];
  }>({});
  const [additionalRequests, setAdditionalRequests] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const additionalRequestsRef = useRef<View>(null);
  const [additionalRequestsY, setAdditionalRequestsY] = useState(0);

  const totalPrice =
    item.price +
    Object.values(selectedModifiers)
      .flat()
      .reduce((sum, mod) => sum + mod.price, 0);

  const handleModifierSelection = (groupId: string, option: Modifier) => {
    setSelectedModifiers((prev) => ({
      ...prev,
      [groupId]: prev[groupId]?.some((mod) => mod.id === option.id)
        ? prev[groupId].filter((mod) => mod.id !== option.id)
        : [...(prev[groupId] || []), option],
    }));
  };

  const handleAddToCart = async () => {
    try {
      const currentCart = JSON.parse(
        (await AsyncStorage.getItem("cart")) || "[]"
      );
      
      // Try three different sources for the business ID in order of priority
      // 1. From URL params (most reliable)
      // 2. From the business ID service
      // 3. From direct AsyncStorage access (fallback)
      
      let businessId = params.shopId || '';
      
      if (!businessId) {
        // Try to get from business ID service
        const storedId = await getCurrentBusinessId();
        if (storedId) {
          businessId = storedId;
          console.log("Retrieved businessId from service:", businessId);
        }
      } else {
        console.log("Using businessId from params:", businessId);
      }
      
      // Final fallback to AsyncStorage directly
      if (!businessId) {
        const asyncId = await AsyncStorage.getItem("currentBusinessId");
        if (asyncId) {
          businessId = asyncId;
          console.log("Retrieved businessId from AsyncStorage directly:", businessId);
        }
      }
      
      // If still no businessId, log a warning
      if (!businessId) {
        console.warn("No businessId found for cart item - this will cause order placement to fail");
      }
      
      // Flatten selectedModifiers for the cart and add modifier_group_id
      const flatModifiers = Object.entries(selectedModifiers).flatMap(([groupId, mods]) => 
        mods.map(mod => ({
          ...mod, // Spread existing modifier properties (id, name, price)
          modifier_group_id: groupId // Add the group ID as modifier_group_id
        }))
      );
      
      const newCartItem = {
        id: item.id, // Original item ID
        name: item.name, // Original item name
        price: item.price, // Original base price of the item
        basePrice: item.price, // Explicitly store base price
        quantity: 1,
        modifiers: flatModifiers, // Correctly structured flat array of modifiers with their own prices
        additionalRequests,
        shopName,
        shopAddress,
        businessId: businessId, 
      };

      // Log the new cart item to verify its structure, especially modifiers
      console.log("Adding to cart:", JSON.stringify(newCartItem, null, 2));

      await AsyncStorage.setItem(
        "cart",
        JSON.stringify([...currentCart, newCartItem])
      );
      // Alert.alert("Success", "Item added to cart!"); // Removed popup
      router.back();
    } catch (error) {
      console.error("Cart update error:", error);
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  const measurePosition = () => {
    additionalRequestsRef.current?.measureInWindow((_, y) =>
      setAdditionalRequestsY(y)
    );
  };

  useEffect(() => {
    const keyboardShow = Keyboard.addListener("keyboardDidShow", (event) => {
      const scrollPosition =
        additionalRequestsY -
        (event.endCoordinates.screenY - event.endCoordinates.height);
      if (scrollPosition > 0)
        scrollViewRef.current?.scrollTo({ y: scrollPosition, animated: true });
    });

    const keyboardHide = Keyboard.addListener("keyboardDidHide", () => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });

    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, [additionalRequestsY]);

  return (
    <View style={styles.container}>
      <Header title="Add to Cart" showBackButton={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={item.image ? { uri: item.image } : require('../assets/item-placeholder.webp')}
            style={{
              width: 160,
              height: 160,
              marginTop: 24,
              marginBottom: 24,
              alignSelf: 'center',
              borderRadius: 16, // optional: for rounded corners
              backgroundColor: '#f5f5f5', // optional: subtle background
            }}
            resizeMode="contain"
          />
          <Text style={styles.itemName}>{item.name}</Text>

          {!noModifiers &&
            item.modifiers.map((group) => (
              <View key={group.groupId} style={styles.modifierGroup}>
                <Text style={styles.groupName}>{group.groupName}</Text>
                {group.options.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.modifierOption,
                      selectedModifiers[group.groupId]?.some(
                        (m) => m.id === option.id
                      ) && styles.selectedModifierOption,
                    ]}
                    onPress={() =>
                      handleModifierSelection(group.groupId, option)
                    }
                  >
                    <Text style={styles.optionName}>{option.name}</Text>
                    <Text style={styles.optionPrice}>
                      +${option.price.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

          <View
            ref={additionalRequestsRef}
            onLayout={measurePosition}
            style={styles.additionalRequestsContainer}
          >
            <Text style={styles.additionalRequestsLabel}>
              Additional Requests
            </Text>
            <TextInput
              style={styles.additionalRequestsInput}
              placeholder="Enter any special requests or comments..."
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
              value={additionalRequests}
              onChangeText={setAdditionalRequests}
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.totalPriceText}>
            Total: ${totalPrice.toFixed(2)}
          </Text>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
