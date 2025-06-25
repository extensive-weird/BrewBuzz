import express from "express";
import dotenv from "dotenv";
import s3TestRoutes from "./api/s3TestRoutes.mjs";
import signUpRoutes from "./api/signUpRoutes.mjs";
import loginRoutes from "./api/signInRoutes.mjs";
import businessRoutes from "./api/businessRoutes.mjs";
import protectedRoutes from "./api/protectedRoutes.mjs";
import homepageRoutes from "./api/homepageRoutes.mjs";
import sequelize from "./config/sequelize.mjs";
import reviewRoutes from "./api/reviewRoutes.mjs";
import passwordRoutes from "./api/passwordRoutes.mjs";
import changePasswordRoutes from "./api/changePasswordRoutes.mjs";
import menuRoutes from "./api/menuRoutes.mjs";
import orderRoutes from "./api/orderRoutes.mjs";
import favoriteRoutes from "./api/favoriteRoutes.mjs";

import rewardsRoutes from "./api/rewardsRoutes.mjs";

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const swaggerDocument = YAML.load("./swagger.yaml");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Setup routes
app.use(s3TestRoutes);
app.use(signUpRoutes);
app.use(loginRoutes);
app.use(passwordRoutes);
app.use(reviewRoutes);
app.use(businessRoutes);
app.use(protectedRoutes);
app.use(homepageRoutes);
app.use(menuRoutes);
app.use(favoriteRoutes);
app.use(orderRoutes);
app.use(changePasswordRoutes);
app.use(rewardsRoutes);

// Database Connection
async function connectDatabase() {
  try {
    // Sync database schema with Sequelize models
    await sequelize.sync({ alter: true });
    console.log("Database connected and synced successfully.");
  } catch (error) {
    console.error(`Database connection or sync failed: ${error.message}`);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

(async () => {
  try {
    await connectDatabase(); // Call the database connection function
    console.log("Server is ready to handle requests.");
  } catch (error) {
    console.error("Failed to start the server due to database issues.");
    process.exit(1); // Exit the process if the database connection fails
  }
})();

export default app;
