/**
 * Favorite Model Definition
 * -------------------------
 * This Sequelize model defines the 'Favorite' table schema used to track businesses
 * that users have marked as favorites within the application.
 *
 * Fields:
 * - id: Auto-incrementing primary key
 * - user_id: Foreign key referencing the 'User' model (required)
 * - businessId: Foreign key referencing the 'Business' model (required)
 *
 * Configuration:
 * - Table Name: 'favorites'
 * - Timestamps: Enabled (automatically adds 'createdAt' and 'updatedAt')
 *
 * Associations:
 * - A User can have many Favorites (one-to-many)
 * - A Business can have many Favorites (one-to-many)
 * - Each Favorite belongs to one User and one Business
 *
 * Usage:
 * This model allows users to mark and manage their favorite coffee shops or businesses.
 * It supports functionality such as toggling favorites, retrieving a user's favorite businesses,
 * and linking favorite counts to businesses for metrics or display.
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.mjs";
import User from "./User.mjs";
import Business from "./Business.mjs";

const Favorite = sequelize.define(
    "Favorite",
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

        businessId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Business,
                key: "id",
            },
        },
    },
    {
        tableName: "favorites",
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Define associations
User.hasMany(Favorite, { foreignKey: "user_id", onDelete: "CASCADE" });
Favorite.belongsTo(User, { foreignKey: "user_id" });

Business.hasMany(Favorite, { foreignKey: "businessId", onDelete: "CASCADE" });
Favorite.belongsTo(Business, { foreignKey: "businessId" });

export default Favorite;
