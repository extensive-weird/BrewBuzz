/**
 * Create Business Controller
 * --------------------------
 * Creates a new business record for the authenticated user.
 *
 * - Validates required fields.
 * - Uploads a cover photo to storage (S3) if provided.
 * - Associates the business with the authenticated user.
 * - Sends push notifications to customers about new business.
 *
 * Notes:
 * - Requires authentication middleware to populate req.user.
 */

import Business from "../models/Business.mjs";
import { uploadFileToS3 } from "../services/s3Service.mjs";
import { getAllCustomerPushTokens } from "./userController.mjs";
import { sendPushNotifications } from "../services/expoPushService.mjs";

/**
 * Creates a new business for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export async function createBusiness(req, res) {
  try {
    const {
      name,
      category,
      description,
      location,
      phone_number,
      clover_api_token,
      merchant_id,
    } = req.body;

    // Validate required fields
    const requiredFields = [
      "name",
      "location",
      "phone_number",
      "clover_api_token",
      "merchant_id",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "All required fields must be provided",
        missingFields,
      });
    }

    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Upload cover photo to S3
    let coverPhotoUrl = "./uploads/default-image.jpeg"; // Default image
    if (req.file) {
      try {
        coverPhotoUrl = await uploadFileToS3(req.file);
      } catch (error) {
        console.error("Error uploading cover photo:", error);
        return res.status(500).json({
          message: "Failed to upload cover photo",
          error: error.message,
        });
      }
    }

    // Create business record
    const business = await Business.create({
      user_id: req.user.id,
      name,
      category: category || null, // Handle optional field
      description: description || null, // Handle optional field
      location,
      phone_number,
      cover_photo: coverPhotoUrl,
      clover_api_token,
      merchant_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    console.log("----start-----");
    // Send push notifications to customers
    try {
      const tokens = await getAllCustomerPushTokens();
      if (tokens && tokens.length > 0) {
        await sendPushNotifications(
          tokens,
          "New Business Created",
          `A new business has been created: ${business.name}`
        );
      }

      console.log("----tokens-----", tokens);
    } catch (notificationError) {
      // Log error but don't fail the request
      console.error("Error sending push notifications:", notificationError);
    }

    console.log("----end-----");

    // Return success response
    res.status(201).json({
      message: "Business created successfully",
      business: {
        id: business.id,
        name: business.name,
        category: business.category,
        description: business.description,
        location: business.location,
        phone_number: business.phone_number,
        cover_photo: business.cover_photo,
        created_at: business.created_at,
      },
    });
  } catch (error) {
    console.error("Error creating business:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
