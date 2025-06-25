import BusinessRewardsConfig from "../../models/rewards/BusinessRewardsConfig.mjs";
import RewardTier from "../../models/rewards/RewardTier.mjs";
/**
 * Get business rewards configuration and tiers for the authenticated business
 */
export async function getBusinessRewards(req, res) {
  try {
    // Find existing config
    let rewardsConfig = await BusinessRewardsConfig.findOne({
      order: [["id", "ASC"]],
    });
    if (!rewardsConfig) {
      rewardsConfig = await BusinessRewardsConfig.create({
        pointsPerDollar: 1,
      });
    }
    // Get reward tiers for this business
    const rewardTiers = await RewardTier.findAll({
      where: { business_rewards_config_id: rewardsConfig.id },
      order: [["required_points", "ASC"]], // Order by points required (ascending)
    });
    return res.status(200).json({
      success: true,
      data: {
        rewardsConfig: {
          id: rewardsConfig.id,
          pointsPerDollar: rewardsConfig.pointsPerDollar,
        },
        rewardTiers: rewardTiers.map((tier) => ({
          id: tier.id,
          pointsRequired: tier.required_points,
          rewardTitle: tier.reward_title,
          rewardDescription: tier.reward_description,
          isActive: tier.isActive,
        })),
      },
    });
  } catch (error) {
    console.error("Error retrieving business rewards:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve business rewards configuration",
      error: error.message,
    });
  }
}
