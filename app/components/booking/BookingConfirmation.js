"use client";

import { useState } from 'react';
import Image from 'next/image';

import BookingPayment from "./BookingPayment";

export default function BookingConfirmation({ booking, bookingId, onBookAgain }) {
  const [paid, setPaid] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [showingDirections, setShowingDirections] = useState(false);
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    // Fix timezone issue by ensuring the date string is treated as UTC
    // Parse the date parts from the YYYY-MM-DD string to avoid timezone shifts
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    // Create date with local timezone (months are 0-indexed in JS Date)
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-US', options);
  };

  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
      <p className="text-gray-600 mb-6">
        Thank you for booking with Vibe Surf School. We're excited to see you on the waves!
      </p>
      
      {bookingId && (
        <p className="text-sm text-gray-500 mb-8">
          Booking Reference: <span className="font-medium">{bookingId}</span>
        </p>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8 mx-auto max-w-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-left">Booking Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
          <div>
            <p className="text-sm text-gray-500">Activity</p>
            <p className="font-medium">{booking.activity?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{booking.beach?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{formatDate(booking.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium">{booking.startTime} - {booking.endTime}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Participants</p>
            <p className="font-medium">{booking.participants}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Price</p>
            <p className="font-medium">
              {booking.activity?.price === 0 ? 'Inquire' : `$${booking.activity?.price * booking.participants}`}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-800 mb-2 text-left">Your Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p>{booking.clientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{booking.clientEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p>{booking.clientPhone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 mb-8 mx-auto max-w-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-2">What to Bring</h3>
        <ul className="text-left list-disc pl-5 space-y-1">
          <li>Swimsuit or board shorts</li>
          <li>Towel</li>
          <li>Sunscreen</li>
          <li>Water bottle</li>
          <li>Positive Vibes</li>
        </ul>
      </div>

      <button
        onClick={() => setShowingDirections(!showingDirections)}
        className="bg-[#005d8e] text-white font-medium mb-6 px-4 py-2 rounded-md hover:bg-[#00486e] transition-colors flex items-center justify-center mx-auto"
      >
        {showingDirections ? 'Hide Directions' : 'Show Directions'}
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${showingDirections ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showingDirections && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 mx-auto max-w-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-left">Getting There</h3>
          <div className="relative h-64 mb-4">
            <Image
              src={`/images/locations/${booking.beach?.id}.jpg`}
              alt={`Map to ${booking.beach?.name}`}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="text-left">
            <h4 className="font-medium text-gray-800 mb-2">{booking.beach?.name}</h4>
            <p className="text-gray-600 mb-4">{booking.beach?.address}</p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.beach?.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#005d8e] font-medium flex items-center"
            >
              Get Directions
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
        <button
          onClick={onBookAgain}
          className="px-6 py-3 bg-[#005d8e] text-white rounded-md font-medium hover:bg-[#00486e] transition-colors"
        >
          Book Another Activity
        </button>
        <a
          href="/"
          className="px-6 py-3 bg-[#005d8e] text-white rounded-md font-medium hover:bg-[#00486e] transition-colors"
        >
          Return to Homepage
        </a>
      </div>
    </div>
  );
}
