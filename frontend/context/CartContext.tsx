import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../app/(tabs)/cart'; // Assuming CartItem is exported from cart.tsx

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  getCartItemCount: () => number;
  loadCart: () => Promise<void>;
  clearCart: () => Promise<void>; // Added for completeness
  // Potentially add other functions like removeFromCart, updateItemQuantity etc.
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps { // Define props interface
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        setCart(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Failed to load cart from storage', error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (item: CartItem) => {
    try {
      const updatedCart = [...cart];
      const existingItemIndex = updatedCart.findIndex(cartItem => cartItem.id === item.id && JSON.stringify(cartItem.modifiers) === JSON.stringify(item.modifiers));

      if (existingItemIndex > -1) {
        // For simplicity, let's assume adding the same item (with same modifiers) increases quantity
        // Or, if your CartItem has a quantity property, you'd update that.
        // This example replaces the item, assuming new additions are distinct or should overwrite.
        // You might need more sophisticated logic here based on your app's requirements,
        // e.g., if CartItem has a 'quantity' field.
        // For now, let's assume each call to addToCart for an "identical" item (id + modifiers)
        // should be treated as a separate entry or you handle quantity within CartItem.
        // The current CartItem structure doesn't have quantity, so we add as new.
        updatedCart.push(item); // Or update quantity if applicable
      } else {
        updatedCart.push(item);
      }
      setCart(updatedCart);
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Failed to add item to cart', error);
    }
  };

  const getCartItemCount = () => {
    // This should sum quantities if your CartItem has a quantity property.
    // For now, it's the number of unique item entries.
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  const clearCart = async () => {
    try {
      setCart([]);
      await AsyncStorage.setItem('cart', JSON.stringify([]));
    } catch (error) {
      console.error('Failed to clear cart', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, getCartItemCount, loadCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
