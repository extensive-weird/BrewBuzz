/**
 * Business Model Definition
 * -------------------------
 * This Sequelize model defines the 'Business' table schema, representing coffee shops or
 * small businesses registered in the application. Each business is linked to a user (owner).
 *
 * Fields:
 * - id: Auto-incrementing primary key
 * - user_id: Foreign key referencing the 'User' model (business owner) (required)
 * - name: Name of the business (required)
 * - description: Optional detailed description of the business
 * - location: Address or general location of the business (required)
 * - phone_number: Contact number of the business (required)
 * - clover_api_token: Token used to authenticate with the Clover API (required)
 * - merchant_id: Clover merchant ID (required)
 * - cover_photo: Optional cover image URL, with a default fallback image
 * - status: Enum indicating the business state - 'active', 'inactive', or 'deleted' (default: 'active')
 *
 * Configuration:
 * - Table Name: 'businesses'
 * - Timestamps: Enabled (adds 'createdAt' and 'updatedAt')
 *
 * Associations:
 * - Each Business belongs to one User (owner)
 * - Each Business can have many Reviews
 *
 * Usage:
 * This model stores business profile data and integrates with the Clover POS API using
 * tokens and merchant IDs. It supports management of business visibility and metadata.
 * Associations are initialized lazily via the `setupBusinessAssociations()` function.
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.mjs";
import User from "./User.mjs";

const Business = sequelize.define(
  "Business",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clover_api_token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    merchant_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cover_photo: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "deleted"),
      defaultValue: "active", // Businesses are active by default
    },
  },
  {
    tableName: "businesses",
    timestamps: true,
  }
);

// Lazy-load associations
export function setupBusinessAssociations(User, Review) {
  Business.belongsTo(User, { foreignKey: "user_id" });
  Business.hasMany(Review, { foreignKey: "business_id" });
}

export default Business;
