/**
 * User Model Definition
 * ---------------------
 * This Sequelize model defines the 'User' table schema for the application.
 * It includes fields for user identity, credentials, and role classification.
 *
 * Fields:
 * - id: Auto-incrementing primary key
 * - full_name: Full name of the user (required)
 * - email: Unique email address (required)
 * - password: Hashed user password (required)
 * - state: U.S. state or region (required)
 * - zipcode: ZIP/postal code (required)
 * - user_category: Role of the user - 'Customer', 'Business', or 'Admin' (required)
 *
 * Configuration:
 * - Table Name: 'users'
 * - Timestamps: Enabled (adds createdAt and updatedAt)
 *
 * Usage:
 * Import and use this model to create, retrieve, update, and delete user records.
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.mjs";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_category: {
      type: DataTypes.ENUM("Customer", "Business", "Admin"),
      allowNull: false,
    },
    pushToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    yourPoint: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

export default User;
