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

  const handleBeachSelect = (beach) => {
    setFormData(prev => ({ ...prev, beach }));
    setCurrentStep(2);
  };

  const handleActivitySelect = (activity, participants = 1) => {
    setFormData(prev => ({ ...prev, activity, participants }));
    setCurrentStep(3);
  };

  const handleDateTimeSelect = (date, startTime, endTime) => {
    setFormData(prev => ({ ...prev, date, startTime, endTime }));
    setCurrentStep(4);
  };

  const handleCustomerInfoSubmit = (customerInfo) => {
    // Save customer info and move to paywall step
    setFormData(prev => ({ ...prev, ...customerInfo }));
    setPendingBooking({ ...formData, ...customerInfo });
    setCurrentStep(5);
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
            src="/images/surfing/hero-5.jpg" 
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
                      className={`w-24 h-1 ${
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

            {currentStep === 5 && pendingBooking && (
              <BookingPaywall
                bookingData={pendingBooking}
                onBookAgain={resetForm}
                onError={setError}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
