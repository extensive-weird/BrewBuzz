import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import styles from '../styles/CartBottomBarStyles';

const CartBottomBar = () => {
  const [itemCount, setItemCount] = useState(0);
  const [slideAnim] = useState(new Animated.Value(100)); // Start off-screen
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) {
          const parsedCart: Array<{ quantity?: number }> = JSON.parse(storedCart);
          const count = parsedCart.reduce((sum: number, item: { quantity?: number }) => sum + (item.quantity || 1), 0);
          setItemCount(count);
        } else {
          setItemCount(0);
        }
      } catch (error) {
        setItemCount(0);
      }
    };
    fetchCartItems();
    const interval = setInterval(fetchCartItems, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (itemCount > 0) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [itemCount]);

  if (itemCount === 0) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}> 
      <Text style={styles.itemCountText}>{itemCount} item{itemCount > 1 ? 's' : ''} in cart</Text>
      <TouchableOpacity style={styles.viewCartButton} onPress={() => router.push('/(tabs)/cart')}>
        <Text style={styles.viewCartButtonText}>View Cart</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CartBottomBar;
