import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../styles/CartBottomBarStyles';
import { useCart } from '../context/CartContext'; // Import useCart

const CartBottomBar = () => {
  const { getCartItemCount, cart } = useCart(); // Use cart context
  const router = useRouter();
  const itemCount = getCartItemCount();

  // useEffect to re-render when cart changes. 
  // The component will re-render if 'cart' (from useCart) or 'itemCount' changes.
  useEffect(() => {
    // No specific logic needed here if getCartItemCount is efficient
    // and useCart provides up-to-date cart state.
  }, [cart]); // Depend on cart state from context

  if (itemCount === 0) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <Text style={styles.itemCountText}>{itemCount} item{itemCount > 1 ? 's' : ''} in cart</Text>
      <TouchableOpacity 
        style={styles.viewCartButton} 
        onPress={() => router.push('/(tabs)/cart')}
      >
        <Text style={styles.viewCartButtonText}>View Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartBottomBar;
