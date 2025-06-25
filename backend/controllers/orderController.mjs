/**
 * Order Controller
 * ----------------
 * Handles the process of placing an order from cart to confirmation.
 *
 * - placeOrder:
 * • Retrieves user's cart items from the request body
 * • Sends order to Clover
 * • Stores order locally
 * • Does not clear the client-side cart
 *
 * Notes:
 * - Handles business and cart validation
 */

import fetch from "node-fetch";
import Business from "../models/Business.mjs";
import Order from "../models/Order.mjs";
import { createCloverOrder, addCloverLineItems, addCloverPayment, fetchCloverTenders } from "../services/cloverService.mjs";

export async function placeOrder(req, res) {
    try {
        const user_id = req.user.id;
        const { business_id, items: clientItems } = req.body;
        if (!Array.isArray(clientItems) || clientItems.length === 0) {
            return res.status(400).json({ message: "No items provided for order" });
        }
        const cartItems = clientItems;
        const business = await Business.findByPk(business_id);
        if (!business) {
            return res.status(404).json({ message: "Business not found" });
        }
        // Step 4: Calculate total price (in cents)
        const total_price = cartItems.reduce((sum, item) => {
            const price = parseFloat(item.price);
            const quantity = parseInt(item.quantity, 10);
            if (!isNaN(price) && !isNaN(quantity) && quantity > 0) {
                return sum + price * quantity;
            }
            return sum;
        }, 0);
        const totalCents = Math.round(total_price * 100);
        // Step 1: Create Clover order (with total)
        const cloverOrder = await createCloverOrder(business.clover_api_token, business.merchant_id, undefined, totalCents);
        const cloverOrderId = cloverOrder.id;
        // Step 2: Prepare line items for Clover
        const cloverLineItems = [];
        cartItems.forEach(cartItem => {
            const itemPriceInCents = Math.round(parseFloat(cartItem.price) * 100);
            if (isNaN(itemPriceInCents)) return;
            for (let i = 0; i < cartItem.quantity; i++) {
                const lineItem = {
                    item: cartItem.clover_item_id ? { id: cartItem.clover_item_id } : undefined,
                    name: cartItem.name,
                    price: itemPriceInCents
                };
                if (cartItem.selectedModifiers && cartItem.selectedModifiers.length > 0) {
                    lineItem.modifications = cartItem.selectedModifiers.map(mod => ({
                        modifier: { id: mod.clover_modifier_id || mod.id },
                        amount: typeof mod.price_in_cents === 'number' && !isNaN(mod.price_in_cents) ? mod.price_in_cents : 0,
                        name: mod.name
                    }));
                }
                cloverLineItems.push(lineItem);
            }
        });
        if (cloverLineItems.length === 0) {
            return res.status(400).json({ message: "No valid items for Clover order." });
        }
        // Step 3: Add line items to Clover order
        await addCloverLineItems(business.clover_api_token, business.merchant_id, cloverOrderId, cloverLineItems);
        // Step 5: Fetch available tenders and use the first one
        const tenders = await fetchCloverTenders(business.clover_api_token, business.merchant_id);
        if (!tenders.length) {
            return res.status(500).json({ message: "No payment tenders available for this merchant in Clover." });
        }
        const tenderId = tenders[0].id;
        // Step 6: Add payment to Clover order using a valid tender
        const paymentResult = await addCloverPayment(
            business.clover_api_token,
            business.merchant_id,
            cloverOrderId,
            totalCents,
            tenderId
        );
        // Save order in DB
        const newOrder = await Order.create({
            user_id,
            business_id,
            total_price,
            items: cartItems,
            clover_order_id: cloverOrderId
        });
        res.status(200).json({
            message: "Order placed and paid successfully",
            order: newOrder,
            clover_order: cloverOrder,
            clover_payment: paymentResult
        });
    } catch (error) {
        console.error("Error placing order:", error.message);
        res.status(500).json({ message: "Failed to place order", error: error.message });
    }
}