/**
 * Business Controller
 * -------------------
 * Provides endpoints to manage and retrieve business information.
 *
 * - getAllBusinesses: Returns all businesses owned by the authenticated user (active/inactive).
 * - getBusinessById: Fetches a specific business along with dynamic data from Clover (menu & hours).
 *
 * Notes:
 * - Business ownership is verified using the authenticated user's ID.
 * - External Clover API integration enriches the business detail response.
 */




import Business from "../models/Business.mjs";
import { fetchBusinessDataFromClover } from "../services/cloverService.mjs";


export async function getAllBusinesses(req, res) {
    try {
        const businesses = await Business.findAll({
            where: { user_id: req.user.id, status: ["active", "inactive"] }, // Excludes inactive & deleted businesses
        });

        res.status(200).json({ businesses });
    } catch (error) {
        console.error("Error fetching businesses:", error.message);
        res.status(500).json({ message: "Server error while fetching businesses." });
    }
}


export async function getBusinessById(req, res) {
    try {
        const { id } = req.params;

        // Fetch the business from the database
        const business = await Business.findOne({
            where: { id },
            attributes: [
                "id", "name", "location", "phone_number",
                "clover_api_token", "merchant_id", "cover_photo",
                 "description"
            ],
        });

        // Check if the business exists
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }

        // Fetch dynamic data (menu, hours) from Clover
        const cloverData = await fetchBusinessDataFromClover(
            business.clover_api_token,
            business.merchant_id
        );

        if (!cloverData) {
            return res.status(500).json({ message: "Failed to fetch data from Clover" });
        }

        res.status(200).json({
            id: business.id,
            name: business.name,
            location: business.location,
            phone_number: business.phone_number,
            cover_photo: business.cover_photo,
            description: business.description,
            merchant_id: business.merchant_id,
            clover_api_token: business.clover_api_token,
            hours: cloverData.hours,
            menu: cloverData.menu,
        });
    } catch (error) {
        console.error("Error fetching business by ID:", error.message);
        res.status(500).json({ message: "Server error" });
    }
}
