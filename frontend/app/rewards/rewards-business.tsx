import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import {
  getBusinessRewards,
  RewardTier,
  saveBusinessRewards,
} from "../../api/rewards";

import styles from "../../styles/rewards/BussinessRewardStyles";

const SetRewardsScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pointsPerDollar, setPointsPerDollar] = useState("1");
  const [rewardTiers, setRewardTiers] = useState<RewardTier[]>([]);
  const [nextId, setNextId] = useState(0); // For generating local IDs for new tiers

  useEffect(() => {
    // Fetch existing rewards configuration if available
    const fetchRewardsConfig = async () => {
      setLoading(true);
      try {
        const response = await getBusinessRewards();

        if (response.success && response.data) {
          // Set points per dollar
          setPointsPerDollar(
            response.data.rewardsConfig.pointsPerDollar.toString()
          );

          // Map backend reward tiers to frontend format
          const tiers = response.data.rewardTiers.map((tier, index) => ({
            id: tier.id || (index + 1).toString(),
            pointsRequired: tier.pointsRequired,
            rewardDescription: tier.rewardDescription,
            rewardTitle: tier.rewardTitle,
            isActive: true, // All fetched tiers are considered active
          }));

          setRewardTiers(tiers);

          // Set next ID for new tiers
          if (tiers.length > 0) {
            setNextId(tiers.length + 1);
          }
        } else {
          // If no rewards config exists, initialize with default tiers
          setRewardTiers([]);
          setNextId(3);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching rewards config:", error);
        setLoading(false);
        Alert.alert(
          "Error",
          "Failed to load rewards configuration. Please try again."
        );
      }
    };

    fetchRewardsConfig();
  }, []);

  const handleAddTier = () => {
    const newId = nextId.toString();
    setRewardTiers([
      ...rewardTiers,
      {
        id: newId,
        pointsRequired: 0,
        rewardDescription: "",
        rewardTitle: "",
        isActive: true,
      },
    ]);
    setNextId(nextId + 1);
  };

  const handleRemoveTier = (id: string) => {
    setRewardTiers(rewardTiers.filter((tier) => tier.id !== id));
  };

  const handleUpdateTier = (id: string, field: string, value: any) => {
    setRewardTiers(
      rewardTiers.map((tier) =>
        tier.id === id ? { ...tier, [field]: value } : tier
      )
    );
  };

  const handleSaveRewards = async () => {
    // Validate inputs
    const numPointsPerDollar = Number(pointsPerDollar);
    if (isNaN(numPointsPerDollar) || numPointsPerDollar <= 0) {
      Alert.alert("Error", "Points per dollar must be a positive number");
      return;
    }

    // Validate reward tiers - now checking all tiers, not just active ones
    if (rewardTiers.length === 0) {
      Alert.alert("Error", "You must have at least one reward tier");
      return;
    }

    for (const tier of rewardTiers) {
      if (tier.pointsRequired <= 0) {
        Alert.alert("Error", "Points required must be a positive number");
        return;
      }
      if (!tier.rewardDescription.trim()) {
        Alert.alert("Error", "Reward description cannot be empty");
        return;
      }
    }

    setSaving(true);
    try {
      // Format tiers for API - include all tiers without filtering by isActive
      const formattedTiers = rewardTiers.map((tier) => ({
        pointsRequired: tier.pointsRequired,
        rewardTitle: tier.rewardTitle,
        rewardDescription: tier.rewardDescription,
        isActive: tier.isActive,
      }));

      const result = await saveBusinessRewards(
        numPointsPerDollar,
        formattedTiers
      );

      setSaving(false);
      if (result.success) {
        Alert.alert("Success", "Rewards configuration saved successfully!");
      } else {
        Alert.alert(
          "Error",
          result.message ||
            "Failed to save rewards configuration. Please try again."
        );
      }
    } catch (error) {
      console.error("Error saving rewards config:", error);
      setSaving(false);
      Alert.alert(
        "Error",
        "Failed to save rewards configuration. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C67C4E" />
        <Text style={styles.loadingText}>Loading rewards configuration...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Set Rewards" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Points Configuration</Text>
          <View style={styles.pointsConfigContainer}>
            <Text style={styles.pointsConfigLabel}>
              Points earned per $1 spent:
            </Text>
            <TextInput
              style={styles.pointsInput}
              value={pointsPerDollar}
              onChangeText={setPointsPerDollar}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
        </View>
        <View>
          <Text style={styles.sectionTitle}>Reward Tiers</Text>
          <Text style={styles.sectionSubtitle}>
            Configure the rewards customers can redeem with their points
          </Text>
          {rewardTiers.map((tier, index) => (
            <View key={tier.id} style={styles.tierCard}>
              <View style={styles.tierHeader}>
                <Text style={styles.tierTitle}>Reward Tier {index + 1}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveTier(tier.id!)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tierRow}>
                <Text style={styles.tierLabel}>Points Required:</Text>
                <TextInput
                  style={styles.tierInput}
                  value={tier.pointsRequired.toString()}
                  onChangeText={(value) =>
                    handleUpdateTier(
                      tier.id!,
                      "pointsRequired",
                      parseInt(value) || 0
                    )
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.tierRow}>
                <Text style={styles.tierLabel}>Reward Title:</Text>
                <TextInput
                  style={styles.tierInput}
                  value={tier.rewardTitle}
                  onChangeText={(value) =>
                    handleUpdateTier(tier.id!, "rewardTitle", value)
                  }
                  placeholder="e.g., Free Coffee"
                />
              </View>
              <View style={styles.tierRow}>
                <Text style={styles.tierLabel}>Reward Description:</Text>
                <TextInput
                  style={styles.tierInput}
                  value={tier.rewardDescription}
                  onChangeText={(value) =>
                    handleUpdateTier(tier.id!, "rewardDescription", value)
                  }
                  placeholder="e.g., Free Coffee"
                />
              </View>
              <View style={styles.tierRow}>
                <Text style={styles.tierLabel}>Active:</Text>
                <Switch
                  value={tier.isActive}
                  onValueChange={(value) =>
                    handleUpdateTier(tier.id!, "isActive", value)
                  }
                  trackColor={{ false: "#E0E0E0", true: "#C67C4E" }}
                  thumbColor={tier.isActive ? "#FFFFFF" : "#F4F3F4"}
                />
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addTierButton}
            onPress={handleAddTier}
          >
            <Text style={styles.addTierButtonText}>+ Add New Reward Tier</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveRewards}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>
              Save Rewards Configuration
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SetRewardsScreen;
