
/**
 * Business Update Controller
 * --------------------------
 * Allows authenticated business owners to update their business information.
 *
 * - Validates ownership before proceeding
 * - Supports updating details and cover photo
 * - Handles secure file replacement via S3 service
 */
import Business from "../models/Business.mjs";
import { updateFileInS3 } from "../services/s3Service.mjs";


export async function updateBusiness(req, res) {
    try {
        const { id } = req.params;
        const { name, description, location, phone_number, clover_api_token, merchant_id } = req.body;

        const business = await Business.findByPk(id);

        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }

        if (business.user_id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this business" });
        }

        let coverPhotoUrl = business.cover_photo; // Default to the existing photo
        if (req.file) {
            coverPhotoUrl = await updateFileInS3(req.file, business.cover_photo, "business-covers");
        }

        await business.update({
            name,
            description,
            location,
            phone_number,
            cover_photo: coverPhotoUrl,
            clover_api_token,
            merchant_id,
        });

        res.status(200).json({ message: "Business updated successfully", business });
    } catch (error) {
        console.error("Error updating business:", error.message);
        res.status(500).json({ message: "Server error" });
    }
}

