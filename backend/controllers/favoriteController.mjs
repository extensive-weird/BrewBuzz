
/**
 * Favorites Controller
 * --------------------
 * Manages user interactions with favorite businesses.
 *
 * - toggleFavorite:
 *   • Adds or removes a business from the user's favorites
 *   • Validates business existence and toggles based on current state
 *
 * - getFavorites:
 *   • Retrieves all active businesses marked as favorites by the user
 *   • Includes average rating and review count via SQL aggregation
 */


import Favorite from "../models/Favorite.mjs";
import Business from "../models/Business.mjs";
import Review from "../models/Review.mjs";
import sequelize from "../config/sequelize.mjs";

// Toggle favorite

export async function toggleFavorite(req, res) {
    try {
        const businessId = parseInt(req.params.businessId); // ✅ Convert to integer
        const user_id = req.user.id;

        if (isNaN(businessId)) {
            return res.status(400).json({ message: "Invalid business ID" });
        }

        const businessExists = await Business.findByPk(businessId);
        if (!businessExists) {
            return res.status(404).json({ message: "Business not found" });
        }

        const existingFavorite = await Favorite.findOne({ where: { user_id, businessId } });

        if (existingFavorite) {
            await existingFavorite.destroy();
            res.status(200).json({ message: "Removed from favorites" });
        } else {
            await Favorite.create({ user_id, businessId }); // ✅ This now inserts correctly
            res.status(201).json({ message: "Added to favorites" });
        }
    } catch (error) {
        console.error("Error toggling favorite:", error.message);
        res.status(500).json({ message: "Failed to toggle favorite" });
    }
}








//get all favorites
export async function getFavorites(req, res) {
    try {
        const user_id = req.user.id;

        const favorites = await Business.findAll({
            where: { status: "active" },
            attributes: [
                "id",
                "cover_photo",
                "name",
                "location",
                "phone_number",
                "description",
                [
                    sequelize.fn("COALESCE", sequelize.fn("AVG", sequelize.col("Reviews.rating")), 0),
                    "averageRating",
                ],
                [
                    sequelize.fn("COUNT", sequelize.col("Reviews.id")),
                    "reviewCount",
                ],
            ],
            include: [
                {
                    model: Favorite,
                    where: { user_id },
                    attributes: [],
                    required: true,
                },
                {
                    model: Review,
                    attributes: [],
                },
            ],
            group: [
                "Business.id",
                "Business.cover_photo",
                "Business.name",
                "Business.location",
                "Business.phone_number",
                "Business.description"
            ],
            raw: true,
        });
        

        res.status(200).json({
            message: "Favorites retrieved successfully",
            favorites,
        });
    } catch (error) {
        console.error("Error fetching favorites:", error.message);
        res.status(500).json({ message: "Failed to fetch favorites" });
    }
}