"use client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function PayPalProviderClient({ children, clientId }) {
  console.log("PayPal clientId received in client component:", clientId);
  return (
    <PayPalScriptProvider options={{
      "client-id": clientId,
      components: "buttons,funding-eligibility"
    }}>
      {children}
    </PayPalScriptProvider>
  );
}
