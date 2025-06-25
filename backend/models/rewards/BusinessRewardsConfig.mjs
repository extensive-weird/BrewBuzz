import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.mjs";

const BusinessRewardsConfig = sequelize.define(
  "BusinessRewardsConfig",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pointsPerDollar: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 1.0,
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
    tableName: "business_rewards_config",
    timestamps: true,
  }
);

export default BusinessRewardsConfig;
