"use client";

import { useState, useEffect } from 'react';
import { activities } from '../../../data/booking-options';

// Format date properly with fixed timezone handling
const formatDate = (dateValue) => {
  if (!dateValue) return '';
  
  // Handle different date formats (Date object or string)
  let dateObj;
  if (dateValue instanceof Date) {
    dateObj = new Date(dateValue.getTime());
  } else {
    // Parse date string and create a new date at noon to avoid timezone issues
    const parts = dateValue.split('T')[0].split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      dateObj = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
    } else {
      // Fallback - try to parse the string directly
      dateObj = new Date(dateValue);
    }
  }
  
  return dateObj.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export default function CustomerInfoForm({ onSubmit, isSubmitting, formData }) {
  const isGroupActivity = formData.activity?.minParticipants >= 5;
  const [customerData, setCustomerData] = useState({
    discountCode: '',
    clientName: formData.clientName || '',
    clientEmail: formData.clientEmail || '',
    clientPhone: formData.clientPhone || '',
    notes: formData.notes || '',
    participants: isGroupActivity ? formData.participants || 5 : formData.participants || 1,
    groupAges: isGroupActivity ? formData.groupAges || '' : ''
  });
  const [errors, setErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountMessage, setDiscountMessage] = useState('');
  const [showDiscount, setShowDiscount] = useState(false);

  // Find the authoritative activity data from the source to prevent state corruption issues.
  const currentActivity = formData.activity ? activities.find(a => a.id === formData.activity.id) : null;

  // Calculate a reliable base price from the authoritative data.
  const basePrice = currentActivity
    ? currentActivity.isFixedPrice
      ? currentActivity.price
      : currentActivity.price * formData.participants
    : 0;

  // Effect to update the total price whenever the base price or discount changes.
  useEffect(() => {
    setTotalPrice(basePrice - discountAmount);
  }, [basePrice, discountAmount]);

  // Effect to reset the discount when the selected activity changes.
  useEffect(() => {
    setDiscountAmount(0);
    setDiscountMessage('');
    setCustomerData(prev => ({ ...prev, discountCode: '' }));
  }, [currentActivity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!customerData.clientName.trim()) {
      newErrors.clientName = 'Name is required';
    }
    
    if (!customerData.clientEmail.trim()) {
      newErrors.clientEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerData.clientEmail)) {
      newErrors.clientEmail = 'Email is invalid';
    }
    
    if (!customerData.clientPhone.trim()) {
      newErrors.clientPhone = 'Phone number is required';
    }

    // Group activity validation
    if (isGroupActivity) {
      if (!customerData.participants || customerData.participants < 5) {
        newErrors.participants = 'Minimum 5 participants required';
      }
      if (!customerData.groupAges.trim()) {
        newErrors.groupAges = 'Please enter the ages or age ranges of all participants';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyDiscount = () => {
    const code = customerData.discountCode.trim().toLowerCase();
    let discount = 0;
    let message = '';

    if (code === 'vibecrew20') {
      discount = basePrice * 0.20;
      message = '20% discount applied!';
    } else if (code === 'goodvibes10') {
      discount = basePrice * 0.10;
      message = '10% discount applied!';
    } else if (code) {
      message = 'Invalid discount code.';
    }

    setDiscountAmount(discount);
    setDiscountMessage(message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({ ...customerData, totalPrice, discountAmount });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Information</h2>
      <p className="text-gray-600 mb-8">
        Please provide your contact information to complete your booking.
      </p>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Booking Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{formData.beach?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Activity</p>
            <p className="font-medium">{formData.activity?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{formatDate(formData.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium">{formData.startTime} - {formData.endTime}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Participants</p>
            <p className="font-medium">{formData.participants}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{currentActivity?.isFixedPrice ? 'Price' : 'Price per person'}</p>
            <p className="font-medium">${currentActivity?.price.toFixed(2)}</p>
          </div>
          {discountAmount > 0 && (
            <div>
              <p className="text-sm text-gray-500">Discount</p>
              <p className="font-medium text-green-600">-${discountAmount.toFixed(2)}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Total Price</p>
            <p className="font-bold text-lg text-gray-900">${totalPrice.toFixed(2)}</p>
          </div>

        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="clientName" className="block text-gray-700 font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={customerData.clientName}
              onChange={handleChange}
              className={`w-full border ${errors.clientName ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md shadow-sm focus:ring-[#005d8e] focus:border-[#005d8e] focus:outline-none`}
              placeholder="Enter your full name"
              required
            />
            {errors.clientName && (
              <p className="mt-1 text-red-500 text-sm">{errors.clientName}</p>
            )}
          </div>

          <div>
            <label htmlFor="clientEmail" className="block text-gray-700 font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="clientEmail"
              name="clientEmail"
              value={customerData.clientEmail}
              onChange={handleChange}
              className={`w-full border ${errors.clientEmail ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md shadow-sm focus:ring-[#005d8e] focus:border-[#005d8e] focus:outline-none`}
              placeholder="Enter your email address"
              required
            />
            {errors.clientEmail && (
              <p className="mt-1 text-red-500 text-sm">{errors.clientEmail}</p>
            )}
          </div>

          <div>
            <label htmlFor="clientPhone" className="block text-gray-700 font-medium mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="clientPhone"
              name="clientPhone"
              value={customerData.clientPhone}
              onChange={handleChange}
              className={`w-full border ${errors.clientPhone ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md shadow-sm focus:ring-[#005d8e] focus:border-[#005d8e] focus:outline-none`}
              placeholder="Enter your phone number"
              required
            />
            {errors.clientPhone && (
              <p className="mt-1 text-red-500 text-sm">{errors.clientPhone}</p>
            )}
          </div>

          {isGroupActivity && (
            <>
              <div>
                <label htmlFor="participants" className="block text-gray-700 font-medium mb-2">
                  Number of Participants *
                </label>
                <input
                  type="number"
                  id="participants"
                  name="participants"
                  min={5}
                  value={customerData.participants}
                  onChange={handleChange}
                  className={`w-full border ${errors.participants ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md shadow-sm focus:ring-[#005d8e] focus:border-[#005d8e] focus:outline-none`}
                  required
                />
                {errors.participants && (
                  <p className="mt-1 text-red-500 text-sm">{errors.participants}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="groupAges" className="block text-gray-700 font-medium mb-2">
                  Ages or Age Ranges of Participants *
                </label>
                <input
                  type="text"
                  id="groupAges"
                  name="groupAges"
                  placeholder="e.g. 12, 13, 15, 17, 18 or 10-12, 13-15, 16+"
                  value={customerData.groupAges}
                  onChange={handleChange}
                  className={`w-full border ${errors.groupAges ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md shadow-sm focus:ring-[#005d8e] focus:border-[#005d8e] focus:outline-none`}
                  required
                />
                {errors.groupAges && (
                  <p className="mt-1 text-red-500 text-sm">{errors.groupAges}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">List ages or age ranges (e.g. 10-12, 13-15, 16+)</p>
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">
              Special Requests
            </label>
            <textarea
              id="notes"
              name="notes"
              value={customerData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:ring-[#005d8e] focus:border-[#005d8e] focus:outline-none"
              placeholder="Let us know if you have any special requests or requirements"
            />
          </div>

          <div className="md:col-span-2 mt-4">
            {showDiscount ? (
              <div>
                <label htmlFor="discountCode" className="block text-gray-700 font-medium mb-2">
                  Discount Code
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    id="discountCode"
                    name="discountCode"
                    value={customerData.discountCode}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-l-md shadow-sm focus:ring-[#005d8e] focus:border-[#005d8e] focus:outline-none"
                    placeholder="Enter discount code"
                  />
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    className="px-4 py-3 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 font-medium"
                  >
                    Apply
                  </button>
                </div>
                {discountMessage && (
                  <p className={`mt-1 text-sm ${discountMessage.includes('Invalid') ? 'text-red-500' : 'text-green-600'}`}>
                    {discountMessage}
                  </p>
                )}
              </div>
            ) : (
              <span
                onClick={() => setShowDiscount(true)}
                className="text-sm text-blue-600 hover:underline cursor-pointer"
              >
                Have a discount code?
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-md text-white font-medium ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#005d8e] hover:bg-[#00486e]'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Complete Booking'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
