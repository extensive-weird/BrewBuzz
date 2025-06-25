export async function createToken(req, res) {
  const { amount, currency } = req.body;
  try {
    const response = await axios.post(
      "https://api.shift4.com/tokens",
      {
        type: "checkout",
        amount,
        currency,
        callbackUrl: "https://yourdomain.com/payment-complete",
      },
      {
        auth: {
          username: process.env.SHIFT4_SECRET_KEY || "",
          password: "",
        },
      }
    );

    res.json({ token: response.data.id });
  } catch (err) {
    console.error(
      "Error creating Shift4 token:",
      err.response?.data || err.message
    );
    res.status(500).json({ error: "Failed to create payment token" });
  }
}
