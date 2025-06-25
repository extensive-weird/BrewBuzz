import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CustomerRewardPage from "../rewards/rewards-cutomer";
import BusinessRewardPage from "../rewards/rewards-business";

export default function BusinessTab() {
  const [category, setCategory] = useState("");

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          const parsedUser = JSON.parse(user);
          setCategory(parsedUser.user_category || "");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadUserProfile();
  }, []);

  if (category === "") {
    return "";
  }
  return category === "Customer" ? (
    <CustomerRewardPage />
  ) : (
    <BusinessRewardPage />
  );
}
