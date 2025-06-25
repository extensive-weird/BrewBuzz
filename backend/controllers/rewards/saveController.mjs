import BusinessRewardsConfig from "../../models/rewards/BusinessRewardsConfig.mjs";
import RewardTier from "../../models/rewards/RewardTier.mjs";

export async function saveBusinessRewards(req, res) {
  const { pointsPerDollar, rewardTiers } = req.body;

  // Validate input
  if (!pointsPerDollar || !rewardTiers || !Array.isArray(rewardTiers)) {
    return res.status(400).json({
      success: false,
      message: "Invalid rewards configuration data",
    });
  }

  try {
    // Find existing config or create a new one
    let rewardsConfig = await BusinessRewardsConfig.findOne({
      order: [["id", "ASC"]],
    });

    if (rewardsConfig) {
      // Update existing config
      rewardsConfig.pointsPerDollar = pointsPerDollar;
      await rewardsConfig.save();
    } else {
      // Create new config
      rewardsConfig = await BusinessRewardsConfig.create({
        pointsPerDollar: pointsPerDollar,
      });
    }

    // Delete existing reward tiers for this business
    await RewardTier.destroy({
      where: { business_rewards_config_id: rewardsConfig.id },
    });

    // Create new reward tiers
    const createdTiers = await Promise.all(
      rewardTiers.map((tier) =>
        RewardTier.create({
          business_rewards_config_id: rewardsConfig.id,
          required_points: tier.pointsRequired,
          reward_title: tier.rewardTitle,
          reward_description: tier.rewardDescription,
          isActive: tier.isActive,
        })
      )
    );

    return res.status(200).json({
      success: true,
      message: "Business rewards configuration saved successfully",
      data: {
        rewardsConfig,
        rewardTiers: createdTiers,
      },
    });
  } catch (error) {
    console.error("Error saving business rewards:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save business rewards configuration",
      error: error.message,
    });
  }
}
