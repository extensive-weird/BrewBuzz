/**
 * Sequelize Configuration
 * -----------------------
 * Sets up and connects to the PostgreSQL database using environment variables.
 *
 * - connectDatabase(): Authenticates and syncs models.
 * - Exports a configured Sequelize instance.
 */
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Conditionally enable SSL only for production
const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    dialectOptions: isProduction
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {}, // ❌ No SSL in dev
    logging: false,
  }
);

// Function to connect and sync database
export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    await sequelize.sync({ alter: true }); // Sync models
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    throw error; // Re-throw the error to catch it in server.mjs
  }
}

export default sequelize;
