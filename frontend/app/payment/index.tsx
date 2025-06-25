import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";

export default function PaymentScreen() {
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        "http://localhost:4000/api/payment/create-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 1000, // 10.00 USD (in cents)
            currency: "usd",
          }),
        }
      );

      const data = await response.json();
      setPaymentUrl(`https://gateway.shift4.com/checkout/${data.token}`);
    })();
  }, []);

  if (!paymentUrl) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: paymentUrl }}
      onNavigationStateChange={(navState) => {
        if (navState.url.includes("payment-complete")) {
          // Optionally verify with backend or show confirmation
          console.log("Payment completed");
        }
      }}
    />
  );
}
