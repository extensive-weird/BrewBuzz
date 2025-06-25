/**
 * pushNotificationService.ts
 *
 * Push Notification Service
 *
 * This module provides utilities for managing push notifications in the BrewBuzz app.
 *
 * Functions:
 * - registerForPushNotificationsAsync: Handles device registration for push notifications,
 *   including permission requests and Expo push token generation.
 * - handleNotificationError: Standardized error handling for notification-related issues.
 *
 * The service supports both iOS and Android platforms and includes proper error handling
 * for various scenarios like permission denial or simulator usage.
 */

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Handles errors during push notification registration
 * @param errorMessage The error message to display
 * @returns never - throws an error
 */
export const handleNotificationError = (errorMessage: string): never => {
  alert(errorMessage);
  throw new Error(errorMessage);
};

/**
 * Registers the device for push notifications and returns the token
 * @returns Promise with the push notification token
 */
export const registerForPushNotificationsAsync = async (): Promise<string> => {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const isPhysicalDevice = Device.isDevice;

  if (!isPhysicalDevice) {
    console.warn("Running on a simulator. Returning a mock push token.");
    return Promise.resolve("SIMULATOR_PUSH_TOKEN");
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return handleNotificationError(
      "Permission not granted to get push token for push notification!"
    );
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    return handleNotificationError("Project ID not found");
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    console.log("Push token:", pushTokenString);
    return pushTokenString;
  } catch (e: unknown) {
    return handleNotificationError(`${e}`);
  }
};
