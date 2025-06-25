import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const BusinessManagementScreen = () => {
  const router = useRouter();

  const handleSetRewards = () => {
    router.push({
      pathname: "/settings/set_rewards",
    });
  };

  const handleAnalytics = () => {
    // Navigate to analytics page when implemented
    // router.push({ pathname: "/settings/analytics" });
  };

  const handleMenu = () => {
    // Navigate to menu management page when implemented
    // router.push({ pathname: "/settings/menu" });
  };

  const handleSettings = () => {
    // Navigate to business settings page when implemented
    // router.push({ pathname: "/settings/business_settings" });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header with gradient background */}
      <LinearGradient
        colors={["#C67C4E", "#E8A87C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Business Management</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={handleAnalytics}
            >
              <View style={[styles.quickActionIcon, styles.analyticsIcon]}>
                <Text style={styles.iconText}>📊</Text>
              </View>
              <Text style={styles.quickActionText}>Analytics</Text>
              <Text style={styles.quickActionDescription}>
                View business performance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={handleSetRewards}
            >
              <View style={[styles.quickActionIcon, styles.rewardsIcon]}>
                <Text style={styles.iconText}>🏆</Text>
              </View>
              <Text style={styles.quickActionText}>Rewards</Text>
              <Text style={styles.quickActionDescription}>
                Configure loyalty program
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={handleMenu}
            >
              <View style={[styles.quickActionIcon, styles.menuIcon]}>
                <Text style={styles.iconText}>📝</Text>
              </View>
              <Text style={styles.quickActionText}>Menu</Text>
              <Text style={styles.quickActionDescription}>
                Manage your offerings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={handleSettings}
            >
              <View style={[styles.quickActionIcon, styles.settingsIcon]}>
                <Text style={styles.iconText}>⚙️</Text>
              </View>
              <Text style={styles.quickActionText}>Settings</Text>
              <Text style={styles.quickActionDescription}>
                Business configuration
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Business Overview</Text>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Orders Today</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Active Rewards</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Menu Items</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    width: "100%",
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    paddingHorizontal: 20,
  },
  pageTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Sora",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  quickActionsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 16,
    marginLeft: 4,
    fontFamily: "Sora",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionItem: {
    width: (width - 50) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  analyticsIcon: {
    backgroundColor: "#E8F4FF",
  },
  rewardsIcon: {
    backgroundColor: "#FFF4E8",
  },
  menuIcon: {
    backgroundColor: "#F0FFE8",
  },
  settingsIcon: {
    backgroundColor: "#F8E8FF",
  },
  iconText: {
    fontSize: 28,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 5,
  },
  quickActionDescription: {
    fontSize: 12,
    color: "#777777",
  },
  statsContainer: {
    marginTop: 10,
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#C67C4E",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#777777",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#EEEEEE",
    marginHorizontal: 10,
  },
});

export default BusinessManagementScreen;
