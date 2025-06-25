import { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";

interface TabIconProps {
  focused: boolean;
  name: string;
  focusedName?: string;
  iconFamily?: "Ionicons" | "MaterialIcons" | "FontAwesome";
  color?: string;
}

const TabIcon: React.FC<TabIconProps> = ({
  focused,
  name,
  focusedName,
  iconFamily = "Ionicons",
  color,
}) => {
  const iconName = focused && focusedName ? focusedName : name;
  const iconSize = 24;
  const iconColor = focused ? "#C67C4E" : "#999999"; // Coffee color when active

  switch (iconFamily) {
    case "MaterialIcons":
      return (
        <MaterialIcons
          name={iconName as keyof typeof MaterialIcons.glyphMap}
          size={iconSize}
          color={iconColor}
        />
      );
    case "FontAwesome":
      return (
        <FontAwesome
          name={iconName as keyof typeof FontAwesome.glyphMap}
          size={iconSize}
          color={iconColor}
        />
      );
    default:
      return (
        <Ionicons
          name={iconName as keyof typeof Ionicons.glyphMap}
          size={iconSize}
          color={iconColor}
        />
      );
  }
};
export default function TabsLayout() {
  const [userCategory, setUserCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        console.log("🧠 Raw user from storage:", userString);

        const user = userString ? JSON.parse(userString) : null;
        const role = user?.user_category?.toLowerCase();
        console.log("🧾 Detected role:", role);

        setUserCategory(role || null);
      } catch (error) {
        console.error("Error fetching user from AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#C67C4E" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopColor: "#000000",
        },
        tabBarActiveTintColor: "#C67C4E", // Coffee color for active tab text
        tabBarInactiveTintColor: "#999999", // Gray for inactive tab text
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="home-outline" focusedName="home" />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          href: userCategory === "business" ? null : "/favorites",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name="heart-outline"
              focusedName="heart"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="business-tab"
        options={{
          title: "Business",
          href: userCategory === "business" ? "/business-tab" : null,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name="briefcase-outline"
              focusedName="briefcase"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name="gift-outline"
              focusedName="gift"
              iconFamily="Ionicons"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          href: userCategory === "business" ? null : "/cart",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="cart-outline" focusedName="cart" />
          ),
        }}
      />

      <Tabs.Screen
        name="user-profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              name="person-outline"
              focusedName="person"
            />
          ),
        }}
      />
    </Tabs>
  );
}
