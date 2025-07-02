"use client";
import { useState } from "react";
import BookingPayment from "./BookingPayment";
import BookingConfirmation from "./BookingConfirmation";

export default function BookingPaywall({ bookingData, onBookAgain, onError }) {
  const [paid, setPaid] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handlePaymentSuccess = async (paymentDetails) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Send booking data to backend after payment
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bookingData, paymentDetails }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create booking");
      setBookingId(data.bookingId);
      setPaid(true);
    } catch (err) {
      setError(err.message || "An error occurred while processing your booking");
      if (onError) onError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (paid) {
    return (
      <BookingConfirmation booking={bookingData} bookingId={bookingId} onBookAgain={onBookAgain} />
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-900">Pay to Confirm Your Booking</h3>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      <BookingPayment amount={bookingData.totalPrice} onSuccess={handlePaymentSuccess} />
      {isSubmitting && <div className="mt-4 text-blue-600">Finalizing your booking...</div>}
    </div>
  );
}
