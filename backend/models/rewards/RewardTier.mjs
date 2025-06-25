import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.mjs";
import BusinessRewardsConfig from "./BusinessRewardsConfig.mjs";

const RewardTier = sequelize.define(
  "RewardTier",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    business_rewards_config_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: BusinessRewardsConfig,
        key: "id",
      },
    },
    required_points: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    reward_title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reward_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    tableName: "reward_tiers ",
    timestamps: true,
  }
);

export default RewardTier;
