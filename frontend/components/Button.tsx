/**
 * Button.tsx
 *
 * Reusable styled button component.
 *
 * Props:
 * - text: Button label text.
 * - onPress: Callback for button press.
 * - style (optional): Additional custom styling.
 * - loading (optional): Shows a loading spinner when true.
 *
 * UI:
 * - Touchable button with consistent styling (rounded, dark background).
 * - Displays a loading spinner when in loading state.
 */
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";

type Props = {
  text: string;
  onPress: () => void;
  style?: object;
  loading?: boolean;
};

export default function Button({
  text,
  onPress,
  style,
  loading = false,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FFF" />
        </View>
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 70,
    borderRadius: 50,
    marginBottom: 15,
    marginTop: 10,
  },
  text: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 20, // Ensures consistent height when showing spinner
  },
});
