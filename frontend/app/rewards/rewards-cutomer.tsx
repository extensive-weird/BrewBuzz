import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { ProgressBar } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";

import Header from "../../components/Header";

import {
  getBusinessRewards,
  getUserPointsByUserId,
  RewardTier,
} from "../../api/rewards";
import styles from "../../styles/rewards/CustomerRewardStyle";

export default function RewardsScreen() {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rewardTiers, setRewardTiers] = useState<RewardTier[]>([]);
  const [milestones, setMilestones] = useState<number[]>([]);
  const [maxPoints, setMaxPoints] = useState(0);
  const [progress, setProgress] = useState(0);

  // Find next milestone
  const nextMilestone = milestones.find((m) => m > points) || maxPoints;
  const pointsToNextMilestone = nextMilestone - points;

  useEffect(() => {
    // Fetch existing rewards configuration if available
    const fetchRewardsConfig = async () => {
      setLoading(true);
      try {
        // Fetch user points
        const res_userPoints = await getUserPointsByUserId();
        if (res_userPoints.success) {
          setPoints(res_userPoints.points || 0);
        }

        // Fetch business rewards
        const response = await getBusinessRewards();
        if (response.success && response.data) {
          console.log(response.data.rewardTiers);

          // Map backend reward tiers to frontend format
          const tiers = response.data.rewardTiers
            .filter((tier) => tier.isActive)
            .map((tier, index) => {
              const pointsValue = Number(tier.pointsRequired);
              return {
                id: tier.id || (index + 1).toString(),
                pointsRequired: isNaN(pointsValue) ? 0 : pointsValue,
                rewardTitle: tier.rewardTitle,
                rewardDescription: tier.rewardDescription,
                isActive: tier.isActive,
              };
            });

          setRewardTiers(tiers);

          // Extract milestones from reward tiers
          const tierMilestones = tiers
            .map((tier) => tier.pointsRequired)
            .sort((a, b) => a - b);
          setMilestones(tierMilestones);

          // Set max points based on highest milestone
          const highestMilestone =
            tierMilestones.length > 0
              ? tierMilestones[tierMilestones.length - 1]
              : 300; // Fallback to 300 if no tiers
          setMaxPoints(highestMilestone);
        } else {
          // If no rewards config exists, initialize with empty tiers
          setRewardTiers([]);
          setMilestones([25, 50, 100, 150, 200, 300]); // Default fallback milestones
          setMaxPoints(300);
        }
      } catch (error) {
        console.error("Error fetching rewards config:", error);
        Alert.alert(
          "Error",
          "Failed to load rewards configuration. Please try again."
        );
        // Set default values in case of error
        setMilestones([25, 50, 100, 150, 200, 300]);
        setMaxPoints(300);
      } finally {
        setLoading(false);
      }
    };

    fetchRewardsConfig();
  }, []);

  // Update progress whenever points or maxPoints change
  useEffect(() => {
    if (maxPoints > 0) {
      setProgress(Math.min(points / maxPoints, 1));
    } else {
      setProgress(0); // Default to 0 progress if maxPoints is invalid
    }
  }, [points, maxPoints]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C67C4E" />
        <Text style={styles.loadingText}>Loading rewards configuration...</Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Header title="My Rewards" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Points Card */}
        <View style={styles.pointsCard}>
          <View style={styles.pointsHeader}>
            <View>
              <Text style={styles.pointsLabel}>Your Points</Text>
              <Text style={styles.pointsText}>{points}</Text>
            </View>
            <View style={styles.coffeeBeanIcon}>
              <FontAwesome name="coffee" size={24} color="#C67C4E" />
            </View>
          </View>

          {/* Next Milestone */}
          <View style={styles.nextMilestone}>
            <Text style={styles.nextMilestoneText}>
              {pointsToNextMilestone > 0
                ? `${pointsToNextMilestone} points until your next reward!`
                : "You've reached all milestones!"}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={progress}
              color="#C67C4E"
              style={styles.progressBar}
            />

            {/* Milestone Markers */}
            <View style={styles.milestonesContainer}>
              {milestones.map((m, idx) => (
                <View key={idx} style={styles.milestoneMarker}>
                  <View
                    style={[
                      styles.milestoneCircle,
                      points >= m && styles.milestoneCircleActive,
                    ]}
                  />
                  <Text
                    style={[
                      styles.milestoneText,
                      points >= m && styles.milestoneTextActive,
                    ]}
                  >
                    {m}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Available Rewards Section */}
        <View style={styles.rewardsSection}>
          <Text style={styles.sectionTitle}>Available Rewards</Text>

          <View style={styles.rewardsList}>
            {rewardTiers.length > 0 ? (
              rewardTiers.map((reward, idx) => {
                const unlocked = points >= reward.pointsRequired;
                const remaining = reward.pointsRequired - points;

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.rewardCard,
                      unlocked
                        ? styles.rewardCardUnlocked
                        : styles.rewardCardLocked,
                    ]}
                    activeOpacity={unlocked ? 0.7 : 1}
                    onPress={() => {
                      if (unlocked) {
                        Alert.alert(
                          "Redeem Reward",
                          `Would you like to redeem "${reward.rewardTitle}"?`,
                          [
                            { text: "Cancel", style: "cancel" },
                            { text: "Redeem", style: "default" },
                          ]
                        );
                      }
                    }}
                  >
                    {/* Left side: Image as background */}
                    <ImageBackground
                      source={require("../../assets/rewards.png")}
                      style={styles.rewardImageContainer}
                      imageStyle={[
                        styles.backgroundImage,
                        { opacity: unlocked ? 1 : 0.5 },
                      ]}
                    >
                      {!unlocked && (
                        <View style={styles.lockOverlay}>
                          <FontAwesome name="lock" size={24} color="#FFFFFF" />
                        </View>
                      )}
                    </ImageBackground>

                    {/* Right side: Content */}
                    <View style={styles.rewardContent}>
                      {/* Points Badge */}
                      <View
                        style={[
                          styles.badge,
                          unlocked ? styles.badgeUnlocked : styles.badgeLocked,
                        ]}
                      >
                        <Text style={styles.badgeText}>
                          {reward.pointsRequired} pts
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.rewardTitle,
                          unlocked ? styles.textUnlocked : styles.textLocked,
                        ]}
                      >
                        {reward.rewardTitle}
                      </Text>

                      <Text
                        style={[
                          styles.rewardDescription,
                          unlocked ? styles.textUnlocked : styles.textLocked,
                        ]}
                      >
                        {reward.rewardDescription}
                      </Text>

                      <Text
                        style={[
                          styles.rewardStatus,
                          unlocked
                            ? styles.statusUnlocked
                            : styles.statusLocked,
                        ]}
                      >
                        {unlocked
                          ? "Tap to redeem"
                          : `${remaining} more points needed`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.noRewardsText}>
                No rewards available at this time. Check back later!
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
