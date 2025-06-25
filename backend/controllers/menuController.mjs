/**
 * Menu Controller
 * ---------------
 * Handles fetching and caching menu data for a specific business.
 *
 * - getMenu:
 *   • Retrieves menu from Clover API
 *   • Caches the result for 4 hours
 *   • Serves cached data when available
 */

import { fetchBusinessDataFromClover } from "../services/cloverService.mjs";
import Business from "../models/Business.mjs";
import NodeCache from "node-cache";

// Initialize cache with 4-hour expiration, check every 2 hours
const menuCache = new NodeCache({ stdTTL: 14400, checkperiod: 7200 });

export async function getMenu(req, res) {
  try {
    const { business_id } = req.params;
    const cacheKey = `menu-${business_id}`;

    // Check if the entire menu is in cache
    const cachedMenu = menuCache.get(cacheKey);
    if (cachedMenu) {
      console.log(`Serving cached menu for business ${business_id}`);
      return res.status(200).json({ menu: cachedMenu });
    }

    // Fetch business details
    const business = await Business.findOne({
      where: { id: business_id },
      attributes: ["clover_api_token", "merchant_id"],
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Fetch Clover menu data
    const cloverData = await fetchBusinessDataFromClover(
      business.clover_api_token,
      business.merchant_id
    );

    if (!cloverData || !cloverData.menu) {
      return res.status(200).json({ menu: [] });
    }

    // Format menu items (assuming cloverData.menu is the array of items)
    const formattedMenu = cloverData.menu.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price ? parseFloat(item.price) : 0, // Already good
      image: item.image, // Pass raw image URL, let frontend construct full path if needed or handle null
      category: item.category || "Uncategorized",
      modifiers: item.modifiers || [],
    }));

    // Cache the entire formatted menu
    menuCache.set(cacheKey, formattedMenu);
    console.log(`Menu for business ${business_id} fetched and cached.`);

    res.status(200).json({ menu: formattedMenu });
  } catch (error) {
    console.error("Error fetching menu:", error.message);
    res.status(500).json({ message: "Failed to fetch menu" });
  }
}
