"use client";

import { useState } from 'react';
import Image from 'next/image';
import { beaches, activities } from '../../data/booking-options';
import BeachSelection from '../components/booking/BeachSelection';
import ActivitySelection from '../components/booking/ActivitySelection';
import DateTimeSelection from '../components/booking/DateTimeSelection';
import CustomerInfoForm from '../components/booking/CustomerInfoForm';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import BookingPaywall from '../components/booking/BookingPaywall';
import GroupDetailsForm from '../components/booking/GroupDetailsForm';

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    beach: null,
    activity: null,
    date: null,
    startTime: null,
    endTime: null,
    participants: 1,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [error, setError] = useState(null);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [isGroupBooking, setIsGroupBooking] = useState(false);
  const [groupDetails, setGroupDetails] = useState(null);

  const handleBeachSelect = (beach) => {
    setFormData(prev => ({ ...prev, beach }));
    setCurrentStep(2);
  };

  const handleActivitySelect = (activity, participants = 1) => {
    const selectedActivity = { ...activity }; // Create a shallow copy
    setFormData(prev => ({
      ...prev,
      activity: selectedActivity,
      participants: selectedActivity.minParticipants || 1
    }));
    // Detect if this is a group booking (5+)
    if (activity.minParticipants >= 5) {
      setIsGroupBooking(true);
    } else {
      setIsGroupBooking(false);
    }
    setCurrentStep(3);
  };

  const handleDateTimeSelect = (date, startTime, endTime) => {
    setFormData(prev => ({
      ...prev,
      date,
      startTime,
      endTime,
      activity: prev.activity // Explicitly preserve the activity object
    }));
    setCurrentStep(4);
  };

  const handleCustomerInfoSubmit = async (customerInfo) => {
    setIsSubmitting(true);
    setError(null);
    const bookingPayload = { ...formData, ...customerInfo };
    setFormData(bookingPayload); // Update main formData with customerInfo immediately

    try {
      // If group booking, send directly to backend
      if (isGroupBooking) {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...bookingPayload, // bookingPayload already has everything
            isGroupInquiry: true,
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setPendingBooking(null); // Clear pendingBooking if it was a group inquiry from the start
          setBookingComplete(true);
          setBookingId(data.bookingId);
          setCurrentStep(6);
        } else {
          setError(data.message || 'Failed to submit group booking.');
        }
      } else {
        // For regular bookings, go to paywall step
        setPendingBooking(bookingPayload); // pendingBooking now has the complete data
        setCurrentStep(5);
      }
    } catch (err) {
      setError('Failed to submit booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for group details form submission
  const handleGroupDetailsSubmit = async (details) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Send booking and group details to backend
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pendingBooking,
          participants: details.participants,
          groupAges: details.ages,
          notes: details.notes,
          isGroupInquiry: true, // flag for backend
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookingComplete(true);
        setBookingId(data.bookingId);
        setGroupDetails(details);
        setCurrentStep(6); // Show confirmation
      } else {
        setError(data.message || 'Failed to submit group booking.');
      }
    } catch (err) {
      setError('Failed to submit group booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      beach: null,
      activity: null,
      date: null,
      startTime: null,
      endTime: null,
      participants: 1,
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      notes: ''
    });
    setBookingComplete(false);
    setBookingId(null);
    setError(null);
    setCurrentStep(1);
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gray-900 py-20 px-4">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="/images/surfing/202428.jpg" 
            alt="Book your surf lesson"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Book Your Surf Experience</h1>
          <p className="text-white/80 max-w-2xl mx-auto mb-6">
            Choose your beach location, select your activity, and pick a time that works for you.
            Our online booking system makes it easy to reserve your spot on the waves.
          </p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium border-2 
                    ${currentStep >= step 
                      ? 'bg-[#005d8e] text-white border-[#005d8e]' 
                      : 'bg-white text-gray-400 border-gray-300'}`}
                  >
                    {step < 5 ? step : '✓'}
                  </div>
                  {step < 5 && (
                    <div 
                      className={`w-10 md:w-16 lg:w-24 h-1 ${
                        currentStep > step ? 'bg-[#005d8e]' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between px-4 max-w-3xl mx-auto">
              <div className="text-center w-1/5">
                <p className={`text-sm ${currentStep >= 1 ? 'text-[#005d8e] font-medium' : 'text-gray-500'}`}>
                  Select Beach
                </p>
              </div>
              <div className="text-center w-1/5">
                <p className={`text-sm ${currentStep >= 2 ? 'text-[#005d8e] font-medium' : 'text-gray-500'}`}>
                  Choose Activity
                </p>
              </div>
              <div className="text-center w-1/5">
                <p className={`text-sm ${currentStep >= 3 ? 'text-[#005d8e] font-medium' : 'text-gray-500'}`}>
                  Pick Date & Time
                </p>
              </div>
              <div className="text-center w-1/5">
                <p className={`text-sm ${currentStep >= 4 ? 'text-[#005d8e] font-medium' : 'text-gray-500'}`}>
                  Your Details
                </p>
              </div>
              <div className="text-center w-1/5">
                <p className={`text-sm ${currentStep >= 5 ? 'text-[#005d8e] font-medium' : 'text-gray-500'}`}>
                  Confirmation
                </p>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}

            {currentStep === 1 && (
              <BeachSelection 
                beaches={beaches} 
                onSelect={handleBeachSelect} 
                selectedBeach={formData.beach}
              />
            )}

            {currentStep === 2 && (
              <>
                <button 
                  onClick={goBack} 
                  className="bg-white text-[#005d8e] border border-[#005d8e] font-medium px-3 py-1 rounded mb-4 flex items-center hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to beach selection
                </button>
                <ActivitySelection 
                  activities={activities} 
                  onSelect={handleActivitySelect} 
                  selectedActivity={formData.activity}
                  selectedParticipants={formData.participants}
                  selectedBeach={formData.beach}
                />
              </>
            )}

            {currentStep === 3 && (
              <>
                <button 
                  onClick={goBack} 
                  className="bg-white text-[#005d8e] border border-[#005d8e] font-medium px-3 py-1 rounded mb-4 flex items-center hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to activity selection
                </button>
                <DateTimeSelection 
                  onSelectDateTime={handleDateTimeSelect}
                  selectedBeach={formData.beach}
                  selectedActivity={formData.activity}
                  selectedDate={formData.date}
                  selectedTime={formData.startTime}
                />
              </>
            )}

            {currentStep === 4 && (
              <>
                <button 
                  onClick={goBack} 
                  className="bg-white text-[#005d8e] border border-[#005d8e] font-medium px-3 py-1 rounded mb-4 flex items-center hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to date & time selection
                </button>
                <CustomerInfoForm 
                  onSubmit={handleCustomerInfoSubmit} 
                  isSubmitting={isSubmitting}
                  formData={formData}
                />
              </>
            )}

            {/* Step 5: Payment for regular bookings only */}
            {currentStep === 5 && pendingBooking && !isGroupBooking && (
              <BookingPaywall
                bookingData={pendingBooking}
                onBookAgain={resetForm}
                onError={setError}
              />
            )}

            {/* Step 6: Confirmation for all bookings */}
            {currentStep === 6 && bookingComplete && (
              <BookingConfirmation
                booking={pendingBooking || formData}
                bookingId={bookingId}
                onBookAgain={resetForm}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
