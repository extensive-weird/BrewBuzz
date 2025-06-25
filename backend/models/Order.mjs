/**
 * Order Model Definition
 * ----------------------
 * This Sequelize model defines the 'Order' table schema used to store customer orders 
 * placed at various businesses within the application.
 *
 * Fields:
 * - id: Auto-incrementing primary key
 * - user_id: Foreign key referencing the 'User' model (required)
 * - business_id: Foreign key referencing the 'Business' model (required)
 * - total_price: Total price of the order (required, float)
 * - items: JSONB object storing ordered items, quantities, and modifiers (required)
 * - receipt_url: Optional URL to an order receipt (e.g., S3 or internal file link)
 *
 * Configuration:
 * - Table Name: 'orders'
 * - Timestamps: Enabled (adds 'createdAt' and 'updatedAt')
 *
 * Associations:
 * - A User can have many Orders (one-to-many)
 * - A Business can have many Orders (one-to-many)
 * - Each Order belongs to one User and one Business
 *
 * Usage:
 * Use this model to manage order history, retrieve user/business transactions,
 * and integrate with receipt storage or external order processors.
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.mjs";
import User from "./User.mjs";
import Business from "./Business.mjs";

const Order = sequelize.define("Order", {
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
    total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    items: {
        type: DataTypes.JSONB, // Stores ordered items and modifiers
        allowNull: false,
    },
    receipt_url: {
        type: DataTypes.STRING,
        allowNull: true, // Kept as true, but will no longer be populated
    },
    clover_order_id: {
        type: DataTypes.STRING, // New field for Clover order ID
        allowNull: true, // This can also be null
    },
}, {
    tableName: "orders",
    timestamps: true,
});

User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

Business.hasMany(Order, { foreignKey: "business_id" });
Order.belongsTo(Business, { foreignKey: "business_id" });

export default Order;
