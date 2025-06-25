/**
 * Clover API Integration Utility
 * ------------------------------
 * This module provides functions to fetch business-related data from the Clover API,
 * including business details, opening hours, and menu items with modifiers.
 * It implements retry logic and timeout handling to increase resilience
 * against network issues or temporary service failures.
 *
 * Exports:
 * - fetchBusinessDataFromClover(apiToken, merchantId): 
 *   Fetches and returns structured business data including:
 *   • Basic business information (name, address, contact)
 *   • Opening hours
 *   • Menu items with prices, categories, images, and modifier groups
 *
 * Internal Helpers:
 * - fetchWithRetryAndTimeout(url, options, retries, delayMs, timeoutMs): 
 *   Performs fetch requests with retry and timeout support to ensure robust API calls.
 *
 * Features:
 * - Auto-retries failed requests up to a specified number of times
 * - Supports request timeout to prevent long-hanging responses
 * - Transforms and formats Clover data for frontend consumption
 * - Defaults missing values such as images and categories
 */

import fetch from "node-fetch";

// Helper function to perform a fetch with retries and a timeout
async function fetchWithRetryAndTimeout(url, options = {}, retries = 3, delayMs = 1000, timeoutMs = 5000) {
    let currentAttemptDelayMs = delayMs; // Initial delay for the first retry

    for (let i = 0; i < retries; i++) {
        try {
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error(`Request to ${url} timed out after ${timeoutMs}ms`)), timeoutMs)
            );
            const response = await Promise.race([fetch(url, options), timeoutPromise]);

            if (response.ok) {
                return response;
            }

            const status = response.status;
            const statusText = response.statusText;
            let waitMs = currentAttemptDelayMs;

            if (status === 429) {
                const retryAfterHeader = response.headers.get('Retry-After');
                if (retryAfterHeader) {
                    const retryAfterSeconds = parseInt(retryAfterHeader, 10);
                    if (!isNaN(retryAfterSeconds)) {
                        // Use the value from Retry-After (in ms), ensuring it's at least our current backoff value
                        waitMs = Math.max(waitMs, retryAfterSeconds * 1000);
                        console.warn(`Attempt ${i + 1} for ${url} failed: ${status} ${statusText}. Honoring Retry-After: ${retryAfterSeconds}s. Retrying...`);
                    } else {
                        // Retry-After header was present but not a parsable number (e.g., it might be a date string)
                        console.warn(`Attempt ${i + 1} for ${url} failed: ${status} ${statusText}. Retry-After header: '${retryAfterHeader}'. Using exponential backoff. Retrying in ${waitMs / 1000}s...`);
                    }
                } else {
                    console.warn(`Attempt ${i + 1} for ${url} failed: ${status} ${statusText}. Retrying in ${waitMs / 1000}s...`);
                }
            } else {
                 console.warn(`Attempt ${i + 1} for ${url} failed: ${status} ${statusText}. Retrying in ${waitMs / 1000}s...`);
            }
            
            if (i < retries - 1) { // Only wait and backoff if there are more retries left
                 await new Promise(resolve => setTimeout(resolve, waitMs));
                 currentAttemptDelayMs *= 2; // Exponential backoff for the next attempt's delay
            } else {
                // This was the last attempt, and it failed. The loop will terminate and throw an error.
            }

        } catch (error) { // This catch handles network errors or the timeout from Promise.race
            console.error(`Attempt ${i + 1} for ${url} encountered an error: ${error.message}.`);
            if (i < retries - 1) { // Only wait and backoff if there are more retries left
                console.log(`Retrying in ${currentAttemptDelayMs / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, currentAttemptDelayMs));
                currentAttemptDelayMs *= 2; // Exponential backoff for the next attempt's delay
            }
        }
    }
    // If loop finishes, all retries failed.
    throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
}

export async function fetchBusinessDataFromClover(apiToken, merchantId) {
    try {
        const headers = {
            Authorization: `Bearer ${apiToken}`,
        };

        // Fetch Business Details
        const businessDetailsResponse = await fetchWithRetryAndTimeout(
            `https://www.clover.com/v3/merchants/${merchantId}`,
            { headers },
            3,
            1000,
            5000
        );
        const businessDetails = await businessDetailsResponse.json();

        // Fetch Opening Hours
        const hoursResponse = await fetchWithRetryAndTimeout(
            `https://www.clover.com/v3/merchants/${merchantId}/opening_hours`,
            { headers },
            3,
            1000,
            5000
        );
        const hoursData = hoursResponse.ok ? await hoursResponse.json() : {};

        // Fetch Menu Items
        const menuResponse = await fetchWithRetryAndTimeout(
            `https://www.clover.com/v3/merchants/${merchantId}/items?expand=categories,modifierGroups.modifiers`,
            { headers },
            3,
            1000,
            5000
        );
        const menuData = menuResponse.ok ? await menuResponse.json() : {};

        // Process Menu Items
        const menuItems = (menuData.elements || []).map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price / 100, // Assuming Clover API returns price in cents
            image: item.imageUrl, // Remove default image logic, let the frontend handle it
            category: item.categories?.elements?.[0]?.name || "Uncategorized", // Properly fetch category name
            modifiers: (item.modifierGroups?.elements || []).map((group) => ({
                groupId: group.id,
                groupName: group.name,
                options: (group.modifiers?.elements || []).map((modifier) => ({
                    id: modifier.id,
                    name: modifier.name,
                    price: modifier.price / 100, // Convert price to dollars
                })),
            })),
        }));


        return {
            businessDetails: {
                name: businessDetails.name,
                address: businessDetails.address?.address1 || "",
                city: businessDetails.address?.city || "",
                state: businessDetails.address?.state || "",
                zip: businessDetails.address?.zip || "",
                phone: businessDetails.phoneNumber || "",
            },
            hours: hoursData,
            menu: menuItems,
        };
    } catch (error) {
        console.error("Error fetching data from Clover API:", error.message);
        throw new Error("Failed to fetch data from Clover API");
    }
}

/**
 * Create a Clover order (Step 1)
 */
export async function createCloverOrder(apiToken, merchantId, orderTypeId = null) {
    const headers = {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
    };
    const orderBody = {
        state: 'open',
        currency: 'USD',
        total: arguments[3] !== undefined ? arguments[3] : undefined // Pass total in cents if provided
    };
    if (orderTypeId) {
        orderBody.orderType = { id: orderTypeId };
    }
    if (orderBody.total === undefined) {
        delete orderBody.total;
    }
    const response = await fetchWithRetryAndTimeout(
        `https://www.clover.com/v3/merchants/${merchantId}/orders`,
        {
            method: 'POST',
            headers,
            body: JSON.stringify(orderBody),
        }
    );
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Clover order creation failed: ${response.status} - ${errorBody}`);
    }
    return response.json();
}

/**
 * Add line items to a Clover order (Step 2)
 */
export async function addCloverLineItems(apiToken, merchantId, orderId, lineItems) {
    const headers = {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
    };
    // Use bulk endpoint for multiple items
    const response = await fetchWithRetryAndTimeout(
        `https://www.clover.com/v3/merchants/${merchantId}/orders/${orderId}/bulk_line_items`,
        {
            method: 'POST',
            headers,
            body: JSON.stringify({ items: lineItems }),
        }
    );
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Clover add line items failed: ${response.status} - ${errorBody}`);
    }
    return response.json();
}

/**
 * Add a payment to a Clover order (Step 3)
 * amount: in cents (e.g., $10.00 = 1000)
 * tenderId: optional, if you want to specify a payment method
 */
export async function addCloverPayment(apiToken, merchantId, orderId, amount, tenderId = null) {
    const headers = {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
    };
    const paymentBody = {
        amount,
        currency: 'USD',
        order: { id: orderId },
    };
    if (tenderId) {
        paymentBody.tender = { id: tenderId };
    }
    const response = await fetchWithRetryAndTimeout(
        `https://www.clover.com/v3/merchants/${merchantId}/payments`,
        {
            method: 'POST',
            headers,
            body: JSON.stringify(paymentBody),
        }
    );
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Clover payment failed: ${response.status} - ${errorBody}`);
    }
    return response.json();
}

/**
 * Fetch available tenders (payment methods) for a Clover merchant
 * Returns an array of tenders with id and label
 */
export async function fetchCloverTenders(apiToken, merchantId) {
    const headers = {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
    };
    const response = await fetchWithRetryAndTimeout(
        `https://www.clover.com/v3/merchants/${merchantId}/tenders`,
        { headers }
    );
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Clover fetch tenders failed: ${response.status} - ${errorBody}`);
    }
    const data = await response.json();
    return data.elements || [];
}
