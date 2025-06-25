// components/Header.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showNotification?: boolean;
  onBack?: () => void;
}

const Header = ({
  title,
  showBackButton = false,
  showNotification = false,
  onBack,
}: HeaderProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const handleBackButtonPress = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleBackButtonPress}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>{title}</Text>
        </View>
        <View style={styles.rightContainer}>
          {showNotification && (
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <View style={styles.notificationBadge} />
              <Ionicons name="notifications" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12, // Consistent vertical padding
    backgroundColor: "#000000",
  },
  leftContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 2,
    alignItems: "center",
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF5252",
    zIndex: 1,
    borderWidth: 1,
    borderColor: "white",
  },
});

export default Header;
