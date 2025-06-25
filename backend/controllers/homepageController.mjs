/**
 * Homepage Controller
 * -------------------
 * Generates homepage data based on the authenticated user.
 *
 * - Fetches active businesses with average ratings and review counts
 * - Returns functionality based on user role (Customer or Business)
 * - Responds with user info, business list, and accessible routes
 *
 */

import Business from "../models/Business.mjs";
import Review from "../models/Review.mjs";
import sequelize from "../config/sequelize.mjs";

export async function getHomepage(req, res) {
    try {
        const user = req.user; // User details from token

        if (!user) {
            return res.status(401).json({ message: "Unauthorized access. User not found." });
        }

        // Fetch all businesses with average ratings and review count
        const businesses = await Business.findAll({
            where: { status: ["active"] }, // Excludes inactive & deleted businesses
            attributes: [
                "id",
                "cover_photo",
                "name",
                "description",
                "location",
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
                    model: Review,
                    attributes: [], // Exclude individual reviews but allow aggregation
                },
            ],
            raw: true,
            group: ["Business.id"], // Group by business ID for aggregation
        });

        // Base functionality for all roles
        const baseFunctionality = [
            { name: "Homepage", route: "/api/homepage" },
            { name: "Favorite", route: "/api/favorites" },
            { name: "Cart", route: "/api/cart" },
            { name: "Profile", route: "/api/profile" },
        ];

        // Additional functionality for Businesses
        const businessFunctionality = [
            { name: "Business Page", route: "/api/businessess" },
        ];

        // Determine role-based functionality
        const functionality =
            user.user_category === "Business"
                ? [...baseFunctionality, ...businessFunctionality]
                : baseFunctionality;

        res.status(200).json({
            message: `Welcome, ${user.full_name}!`,
            user: {
                id: user.id,
                email: user.email,
                user_category: user.user_category,
                full_name: user.full_name,
            },
            functionality,
            businesses,
        });
    } catch (error) {
        console.error("Error fetching homepage:", error.message);
        res.status(500).json({ message: "Failed to fetch homepage" });
    }
}
