
/**
 * Business Status Controller
 * --------------------------
 * Handles activating and deactivating a business by its owner.
 *
 * - deactivateBusiness: Sets business status to "inactive"
 * - activateBusiness: Sets business status back to "active"
 *
 * Notes:
 * - Ensures only the business owner can perform these actions
 * - Requires authenticated user context via middleware
 */


import  Business  from "../models/Business.mjs";



export async function deactivateBusiness(req, res) {
    const { id } = req.params;

    try {
        const business = await Business.findByPk(id);

        if (!business) {
            return res.status(404).json({ message: "Business not found." });
        }

        if (business.user_id !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to deactivate this business." });
        }

        business.status = "inactive";
        await business.save();

        res.status(200).json({ message: "Business deactivated successfully." });
    } catch (error) {
        console.error("Error deactivating business:", error.message);
        res.status(500).json({ message: "Server error while deactivating the business." });
    }
}

export async function activateBusiness(req, res) {
    const { id } = req.params;

    try {
        const business = await Business.findByPk(id);

        if (!business) {
            return res.status(404).json({ message: "Business not found." });
        }

        if (business.user_id !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to activate this business." });
        }

        business.status = "active";
        await business.save();

        res.status(200).json({ message: "Business activated successfully." });
    } catch (error) {
        console.error("Error activating business:", error.message);
        res.status(500).json({ message: "Server error while activating the business." });
    }
}

