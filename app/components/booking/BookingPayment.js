"use client";
import { PayPalButtons } from "@paypal/react-paypal-js";

export default function BookingPayment({ amount, onSuccess }) {
  return (
    <div>
      <PayPalButtons
        style={{ layout: "vertical" }}
        disableFunding={["paylater"]}
        createOrder={async () => {
          console.log("PayPal createOrder called");
          // Call backend to create PayPal order
          const res = await fetch('/api/paypal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amount.toString(), currency: 'USD' })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to create PayPal order');
          return data.id; // PayPal expects order ID here
        }}
        onApprove={async (data) => {
          console.log("PayPal onApprove called", data);
          // Securely capture payment server-side
          const res = await fetch('/api/paypal/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID })
          });
          const capture = await res.json();
          if (res.ok && capture.status === 'COMPLETED') {
            console.log('PayPal capture successful on client, calling onSuccess:', capture);
            onSuccess(capture); // Pass the full capture details
          } else {
            alert('Payment capture failed or was not completed. Please check console for details.');
            console.error('PayPal capture failed on client:', capture);
          }
        }}
      onError={(err) => {
          console.error("PayPal error", err);
        }}
      />
    </div>
  );
}
