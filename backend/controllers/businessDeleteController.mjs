
/**
 * Delete Business Controller
 * --------------------------
 * Soft-deletes a business by updating its status and removing its cover photo from storage.
 *
 * - Validates ownership before deletion
 * - Deletes cover image from S3 if not using the default image
 * - Marks business as "deleted" without removing it from the database
 *
 */



import Business from "../models/Business.mjs";
import { deleteFileFromS3 } from "../services/s3Service.mjs";

export async function deleteBusiness(req, res) {
    const { id } = req.params;

    try {
        const business = await Business.findByPk(id);

        if (!business) {
            return res.status(404).json({ message: "Business not found." });
        }

        if (business.user_id !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this business." });
        }

        // Delete cover photo from S3 if it exists and is not a default image
        if (business.cover_photo && !business.cover_photo.includes("default-image.jpeg")) {
            await deleteFileFromS3(business.cover_photo);
        }

        // Mark business as deleted in DB
        business.status = "deleted"; // Ensure there's a status column in your model
        await business.save();

        res.status(200).json({ message: "Business deleted successfully, but data is retained." });
    } catch (error) {
        console.error("Error deleting business:", error.message);
        res.status(500).json({ message: "Server error while deleting the business." });
    }
}
