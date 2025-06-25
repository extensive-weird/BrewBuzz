/**
 * Review Model Definition
 * -----------------------
 * This Sequelize model defines the 'Review' table schema, which stores customer reviews
 * and ratings for businesses within the application.
 *
 * Fields:
 * - id: Auto-incrementing primary key
 * - user_id: Foreign key referencing the 'User' model (required)
 * - business_id: Foreign key referencing the 'Business' model (required)
 * - rating: Float value from 1 to 5 (required)
 * - review: Optional text content of the user's review
 *
 * Configuration:
 * - Table Name: 'reviews'
 * - Timestamps: Enabled (automatically adds 'createdAt' and 'updatedAt' fields)
 *
 * Associations:
 * - A User can have many Reviews (one-to-many)
 * - A Business can have many Reviews (one-to-many)
 * - Each Review belongs to a single User and a single Business
 *
 * Usage:
 * Use this model to manage user-submitted reviews for businesses, including ratings and comments.
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.mjs";
import User from "./User.mjs";
import Business from "./Business.mjs";

const Review = sequelize.define(
  "Review",
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
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Business,
        key: "id",
      },
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "reviews",
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Associations
User.hasMany(Review, { foreignKey: "user_id", onDelete: "CASCADE" });
Review.belongsTo(User, { foreignKey: "user_id" });

Business.hasMany(Review, { foreignKey: "business_id", onDelete: "CASCADE" });
Review.belongsTo(Business, { foreignKey: "business_id" });

export default Review;
