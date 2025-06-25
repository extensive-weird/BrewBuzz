import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import styles from "../../styles/CartScreenStyles";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { placeOrderApi } from "../../api/orderApi";
import { fetchUserBusinesses } from "../../api/businessApi";
import { getCurrentBusinessId, debugBusinessId } from "../../service/businessIdService";

// Define the structure for a single modifier object as stored in the cart
export interface CartModifier { // Added export
  id: string;
  name: string;
  price: number;
  modifier_group_id: string; // Crucial for backend processing
}

export interface CartItem { // Added export
  id: string;
  name: string;
  price: number; // This should be the base price of the item
  basePrice?: number; // Explicit base price, if `price` might be altered
  quantity: number;
  shopName: string;
  shopAddress: string;
  businessId: string;
  modifiers?: CartModifier[]; // Updated to be an array of CartModifier objects
  additionalRequests?: string;
}

interface BusinessGroup {
  shopName: string;
  shopAddress: string;
  items: CartItem[];
  total: number;
}

const CartScreen = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [businessGroups, setBusinessGroups] = useState<BusinessGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const storedCart = await AsyncStorage.getItem("cart");
      if (storedCart) {
        let parsedCart: CartItem[] = JSON.parse(storedCart);

        const itemsWithoutBusinessId = parsedCart.filter(item => !item.businessId);
        if (itemsWithoutBusinessId.length > 0) {
          console.warn("Found cart items without businessId:", itemsWithoutBusinessId);
        }

        const needsBusinessId = itemsWithoutBusinessId.length > 0;
        if (needsBusinessId) {
          console.log("Attempting to retrieve missing business IDs");
          await debugBusinessId("Cart-FetchCartItems");
          const currentBusinessId = await getCurrentBusinessId();
          if (currentBusinessId) {
            console.log("Found currentBusinessId:", currentBusinessId);
            parsedCart = parsedCart.map(item =>
              !item.businessId ? { ...item, businessId: currentBusinessId } : item
            );
          }

          const stillMissing = parsedCart.some(item => !item.businessId);
          if (stillMissing) {
            const businessResult = await fetchUserBusinesses();
            console.log("Fetched businesses for matching:", businessResult.businesses?.length || 0);

            if (businessResult.success && businessResult.businesses) {
              parsedCart = parsedCart.map((item) => {
                if (!item.businessId) {
                  const found = businessResult.businesses?.find(
                    (b) =>
                      b.name === item.shopName &&
                      b.location === item.shopAddress
                  );
                  if (found) {
                    console.log(`Found match for ${item.shopName}: businessId=${found.id}`);
                    return { ...item, businessId: found.id };
                  } else {
                    console.warn(`No business match found for: ${item.shopName} at ${item.shopAddress}`);
                  }
                }
                return item;
              });
            }
          }
          await AsyncStorage.setItem("cart", JSON.stringify(parsedCart));
          console.log("Updated cart saved with businessId values");
        }

        setCartItems(parsedCart);
        groupItemsByBusiness(parsedCart);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupItemsByBusiness = (items: CartItem[]) => {
    const groupedItems = items.reduce<{ [key: string]: BusinessGroup }>((
      acc,
      item
    ) => {
      const key = `${item.shopName}-${item.shopAddress}`;
      if (!acc[key]) {
        acc[key] = {
          shopName: item.shopName,
          shopAddress: item.shopAddress,
          items: [],
          total: 0,
        };
      }
      acc[key].items.push({ ...item, businessId: item.businessId });
      const itemTotalWithModifiers = (item.basePrice || item.price) +
                                   (item.modifiers?.reduce((sum, mod) => sum + mod.price, 0) || 0);
      acc[key].total += itemTotalWithModifiers * item.quantity;
      return acc;
    },
    {});
    setBusinessGroups(Object.values(groupedItems));
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const updatedCart = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCart);
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
      groupItemsByBusiness(updatedCart);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const clearCart = async () => {
    Alert.alert("Clear Cart", "Are you sure you want to clear your cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        onPress: async () => {
          await AsyncStorage.removeItem("cart");
          setCartItems([]);
          setBusinessGroups([]);
          Alert.alert("Cart Cleared", "Your cart has been emptied.");
        },
      },
    ]);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const updatedCart = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
      groupItemsByBusiness(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleOrder = async (
    shopName: string,
    shopAddress: string,
    businessId?: string
  ) => {
    Alert.alert("Place Order", `Order from ${shopName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Order",
        onPress: async () => {
          try {
            await debugBusinessId("Cart-BeforeOrder");

            const groupItems = cartItems.filter(
              (item) => item.shopName === shopName && item.shopAddress === shopAddress
            );

            let business_id = groupItems[0]?.businessId || businessId;

            if (!business_id) {
              console.log("No business ID in cart item or params, trying service as fallback");
              business_id = await getCurrentBusinessId() || '';
            }

            if (!business_id) {
              console.error("No business ID found for order. Group items:", groupItems);
              Alert.alert(
                "Error",
                "Business ID not found for this order. Please try removing and re-adding items to your cart from the menu."
              );
              return;
            }
            console.log("Using business ID for order:", business_id);

            const orderItems = groupItems.map(item => {
              const itemName = typeof item.name === 'string' ? item.name : 'Unknown Item';
              const itemBasePrice = typeof item.basePrice === 'number' ? item.basePrice : (typeof item.price === 'number' ? item.price : 0);

              let processedModifiers: any[] = [];
              if (Array.isArray(item.modifiers)) {
                processedModifiers = item.modifiers.map(mod => {
                  const modId = mod?.id;
                  const modName = mod?.name;
                  const modPrice = mod?.price;
                  const modGroupId = mod?.modifier_group_id;

                  if (!modId) console.warn('Modifier is missing an id:', mod);
                  if (!modName) console.warn('Modifier is missing a name:', mod);
                  if (typeof modPrice !== 'number') console.warn('Modifier has a missing or invalid price:', mod);
                  if (!modGroupId) console.warn('Modifier is missing modifier_group_id:', mod);

                  return {
                    id: modId,
                    name: modName,
                    price: modPrice,
                    modifier_group_id: modGroupId,
                  };
                }).filter(mod => mod.id && typeof mod.price === 'number' && mod.modifier_group_id); // Ensure essential fields are present
              }

              return {
                item_id: item.id,
                item_name: itemName,
                price: itemBasePrice, // Send the base price of the item
                quantity: item.quantity,
                modifiers: processedModifiers, // Send the array of modifier objects
              };
            });

            console.log("Mapped order payload items for backend:", JSON.stringify(orderItems, null, 2));

            const result = await placeOrderApi(business_id, orderItems);
             if (result.success) {
               Alert.alert("Order Placed", `Order from ${shopName} confirmed!`);
               const updatedCart = cartItems.filter(
                 (item) => item.shopName !== shopName
               );
               setCartItems(updatedCart);
               setBusinessGroups(
                 businessGroups.filter((group) => group.shopName !== shopName)
               );
               updatedCart.length > 0
                 ? await AsyncStorage.setItem("cart", JSON.stringify(updatedCart))
                 : await AsyncStorage.removeItem("cart");
             } else {
               Alert.alert("Order Error", result.message || "Failed to place order.");
             }
          } catch (error) {
            console.error("Order error:", error);
            Alert.alert("Order Error", "An unexpected error occurred.");
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C67C4E" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <Header title="Cart" />

      {businessGroups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={businessGroups}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 100,
            marginTop: 30,
          }}
          keyExtractor={(group) => `${group.shopName}-${group.shopAddress}`}
          renderItem={({ item: group }) => (
            <View style={styles.businessGroup}>
              <View style={styles.shopInfo}>
                <Text style={styles.shopName}>{group.shopName}</Text>
                <Text style={styles.shopAddress}>{group.shopAddress}</Text>
              </View>

              {group.items.map((item, idx) => {
                // Calculate display price for this item including its modifiers
                const displayItemPrice = (item.basePrice || item.price) +
                                       (item.modifiers?.reduce((sum, mod) => sum + mod.price, 0) || 0);
                return (
                  <View key={item.id + "-" + idx} style={styles.cartItem}>
                    <View style={styles.itemInfo}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        {item.modifiers && item.modifiers.length > 0 && (
                          <Text style={styles.modifierList}>
                            {item.modifiers.map(m => `${m.name} ($${m.price.toFixed(2)})`).join(', ')}
                          </Text>
                        )}
                        <Text style={styles.itemPrice}>
                          ${(displayItemPrice * item.quantity).toFixed(2)}
                        </Text>
                      </View>

                      <View style={styles.quantityAndRemoveContainer}>
                        <View style={styles.quantityContainer}>
                          <TouchableOpacity
                            onPress={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            style={styles.quantityButton}
                          >
                            <Text style={styles.quantityText}>-</Text>
                          </TouchableOpacity>
                          <Text style={styles.quantityNumber}>
                            {item.quantity}
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            style={styles.quantityButton}
                          >
                            <Text style={styles.quantityText}>+</Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          onPress={() => removeFromCart(item.id)}
                          style={styles.removeButton}
                        >
                          <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}

              <View style={styles.businessGroupFooter}>
                <Text style={styles.totalPrice}>
                  Total: ${group.total.toFixed(2)}
                </Text>
                <Button
                  text="Order"
                  onPress={() =>
                    handleOrder(
                      group.shopName,
                      group.shopAddress,
                      group.items[0]?.businessId
                    )
                  }
                  style={styles.orderButton}
                />
              </View>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.clearButtonContainer}>
              <TouchableOpacity onPress={clearCart}>
                <Text style={styles.clearButtonText}>Clear Cart</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

export default CartScreen;