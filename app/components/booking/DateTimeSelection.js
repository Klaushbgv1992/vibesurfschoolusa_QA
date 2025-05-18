"use client";

import { useState, useEffect } from 'react';
import { availableTimes, getActivityEndTime } from '../../../data/booking-options';

export default function DateTimeSelection({ 
  onSelectDateTime, 
  selectedBeach, 
  selectedActivity, 
  selectedDate,
  selectedTime
}) {
  const [date, setDate] = useState(selectedDate || '');
  const [startTime, setStartTime] = useState(selectedTime || '');
  const [availableTimeSlots, setAvailableTimeSlots] = useState(availableTimes);
  const [isLoading, setIsLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [fullyBookedDates, setFullyBookedDates] = useState([]);
  const [allBookings, setAllBookings] = useState({});

  // Calculate minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  // Calculate maximum date (6 months from now)
  const sixMonthsLater = new Date(today);
  sixMonthsLater.setMonth(today.getMonth() + 6);
  const maxDate = sixMonthsLater.toISOString().split('T')[0];

  useEffect(() => {
    // On component mount, make all times available initially
    setAvailableTimeSlots(availableTimes);
    setUnavailableTimes([]);
    fetchAllBookings();
  }, []);
  
  // Fetch all bookings to determine which dates are fully booked
  const fetchAllBookings = async () => {
    try {
      // Only fetch bookings if a date is provided (prevents 400 errors)
      if (!date) return;
      const response = await fetch(`/api/bookings?date=${date}`);
      const data = await response.json();
      
      if (data.success) {
        const bookingsByDate = {};
        data.bookings.forEach(booking => {
          if (!bookingsByDate[booking.date]) {
            bookingsByDate[booking.date] = [];
          }
          bookingsByDate[booking.date].push(booking);
        });
        
        setAllBookings(bookingsByDate);
        
        // Find dates that are fully booked for the selected activity and beach
        checkForFullyBookedDates(bookingsByDate);
      }
    } catch (error) {
      console.error('Error fetching all bookings:', error);
    }
  };
  
  // Check which dates are fully booked
  const checkForFullyBookedDates = (bookingsByDate) => {
    if (!selectedBeach) return;
    
    const fullyBooked = [];
    
    Object.keys(bookingsByDate).forEach(date => {
      // Only filter by beach location, not by activity
      const dateBookings = bookingsByDate[date].filter(booking => 
        booking.beach === selectedBeach.name
      );
      
      // If all time slots for this date are booked
      if (dateBookings.length >= availableTimes.length) {
        fullyBooked.push(date);
      } else {
        // Check if there are enough available slots
        let unavailableCount = 0;
        availableTimes.forEach(time => {
          const endTime = getActivityEndTime(time, selectedActivity.duration);
          
          // Check if this time slot overlaps with any booked slots
          const isUnavailable = dateBookings.some(booking => {
            return (
              (time >= booking.startTime && time < booking.endTime) || 
              (endTime > booking.startTime && endTime <= booking.endTime) || 
              (time <= booking.startTime && endTime >= booking.endTime)
            );
          });
          
          if (isUnavailable) {
            unavailableCount++;
          }
        });
        
        // If all time slots are unavailable, mark the date as fully booked
        if (unavailableCount >= availableTimes.length) {
          fullyBooked.push(date);
        }
      }
    });
    
    setFullyBookedDates(fullyBooked);
  };

  useEffect(() => {
    // Reset time if date changes
    setStartTime('');
    
    if (date) {
      fetchAvailability();
    }
  }, [date]);
  
  useEffect(() => {
    // When beach or activity changes, check for fully booked dates
    if (selectedBeach && selectedActivity && allBookings) {
      checkForFullyBookedDates(allBookings);
    }
  }, [selectedBeach, selectedActivity]);

  const fetchAvailability = async () => {
    if (!selectedBeach || !selectedActivity || !date) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings?date=${date}`);
      const data = await response.json();
      
      if (data.success) {
        // Filter out bookings for the same beach only (not activity-specific)
        const relevantBookings = data.bookings.filter(booking => 
          booking.beach === selectedBeach.name
        );
        
        setBookedSlots(relevantBookings);
        
        // Find unavailable times
        const unavailable = [];
        availableTimes.forEach(time => {
          const endTime = getActivityEndTime(time, selectedActivity.duration);
          
          // Check if this time slot overlaps with any booked slots
          const isUnavailable = relevantBookings.some(booking => {
            return (
              (time >= booking.startTime && time < booking.endTime) || // Start time within booked slot
              (endTime > booking.startTime && endTime <= booking.endTime) || // End time within booked slot
              (time <= booking.startTime && endTime >= booking.endTime) // Completely contains booked slot
            );
          });
          
          if (isUnavailable) {
            unavailable.push(time);
          }
        });
        
        setUnavailableTimes(unavailable);
        setAvailableTimeSlots(availableTimes.filter(time => !unavailable.includes(time)));
      } else {
        console.error('Failed to fetch availability');
        setAvailableTimeSlots(availableTimes);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailableTimeSlots(availableTimes);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (date && startTime) {
      const endTime = getActivityEndTime(startTime, selectedActivity.duration);
      onSelectDateTime(date, startTime, endTime);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const isTimeAvailable = (time) => {
    return !unavailableTimes.includes(time);
  };
  
  // This function is now replaced with inline formatting

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Date & Time</h2>
      <p className="text-gray-600 mb-6">
        Choose your preferred date and time for your {selectedActivity?.name} at {selectedBeach?.name}.
        <span className="block mt-1 font-medium text-[#005d8e]">All times shown are in Eastern Standard Time (EST).</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Date Selection */}
        <div>
          <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => {
              // Check if the selected date is fully booked
              if (fullyBookedDates.includes(e.target.value)) {
                alert('This date is fully booked. Please select another date.');
                return;
              }
              setDate(e.target.value);
            }}
            min={minDate}
            max={maxDate}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005d8e]"
            onFocus={(e) => {
              // Custom datepicker functionality
              e.target.showPicker && e.target.showPicker();
            }}
            onInvalid={(e) => {
              // Check if the selected date is fully booked
              if (fullyBookedDates.includes(e.target.value)) {
                e.preventDefault();
                alert('This date is fully booked. Please select another date.');
              }
            }}
            required
          />

          {date && (
            <div className="mt-3 p-3 bg-blue-50 rounded-md">
              <p className="text-blue-700 font-medium">{formatDate(date)}</p>
            </div>
          )}
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Available Time Slots <span className="text-sm text-gray-500">(EST)</span>
          </label>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005d8e]"></div>
              <p className="ml-3 text-gray-600">Checking availability...</p>
            </div>
          ) : date ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Morning Times */}
              <button
                onClick={() => isTimeAvailable('07:00') && setStartTime('07:00')}
                className={`py-3 px-4 rounded-md text-center border border-gray-300 relative ${startTime === '07:00' ? 'bg-[#005d8e] text-white' : isTimeAvailable('07:00') ? 'bg-gray-50 text-gray-800 hover:bg-blue-50' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={!isTimeAvailable('07:00')}
              >
                <span className="block font-medium text-inherit">7:00 AM</span>
                <span className="block text-xs mt-1 text-inherit">{isTimeAvailable('07:00') ? `to ${selectedActivity?.category === 'SCUBA' ? '8:30' : '8:00'} AM` : 'Unavailable'}</span>
                {!isTimeAvailable('07:00') && <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 rounded-md"><span className="text-xs font-medium text-gray-600">Unavailable</span></div>}
              </button>
              
              <button
                onClick={() => isTimeAvailable('08:00') && setStartTime('08:00')}
                className={`py-3 px-4 rounded-md text-center border border-gray-300 relative ${startTime === '08:00' ? 'bg-[#005d8e] text-white' : isTimeAvailable('08:00') ? 'bg-gray-50 text-gray-800 hover:bg-blue-50' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={!isTimeAvailable('08:00')}
              >
                <span className="block font-medium text-inherit">8:00 AM</span>
                <span className="block text-xs mt-1 text-inherit">{isTimeAvailable('08:00') ? `to ${selectedActivity?.category === 'SCUBA' ? '9:30' : '9:00'} AM` : 'Unavailable'}</span>
                {!isTimeAvailable('08:00') && <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 rounded-md"><span className="text-xs font-medium text-gray-600">Unavailable</span></div>}
              </button>
              
              <button
                onClick={() => isTimeAvailable('09:00') && setStartTime('09:00')}
                className={`py-3 px-4 rounded-md text-center border border-gray-300 relative ${startTime === '09:00' ? 'bg-[#005d8e] text-white' : isTimeAvailable('09:00') ? 'bg-gray-50 text-gray-800 hover:bg-blue-50' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={!isTimeAvailable('09:00')}
              >
                <span className="block font-medium text-inherit">9:00 AM</span>
                <span className="block text-xs mt-1 text-inherit">{isTimeAvailable('09:00') ? `to ${selectedActivity?.category === 'SCUBA' ? '10:30' : '10:00'} AM` : 'Unavailable'}</span>
                {!isTimeAvailable('09:00') && <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 rounded-md"><span className="text-xs font-medium text-gray-600">Unavailable</span></div>}
              </button>
              
              <button
                onClick={() => isTimeAvailable('10:00') && setStartTime('10:00')}
                className={`py-3 px-4 rounded-md text-center border border-gray-300 relative ${startTime === '10:00' ? 'bg-[#005d8e] text-white' : isTimeAvailable('10:00') ? 'bg-gray-50 text-gray-800 hover:bg-blue-50' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={!isTimeAvailable('10:00')}
              >
                <span className="block font-medium text-inherit">10:00 AM</span>
                <span className="block text-xs mt-1 text-inherit">{isTimeAvailable('10:00') ? `to ${selectedActivity?.category === 'SCUBA' ? '11:30' : '11:00'} AM` : 'Unavailable'}</span>
                {!isTimeAvailable('10:00') && <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 rounded-md"><span className="text-xs font-medium text-gray-600">Unavailable</span></div>}
              </button>
              
              <button
                onClick={() => isTimeAvailable('11:00') && setStartTime('11:00')}
                className={`py-3 px-4 rounded-md text-center border border-gray-300 relative ${startTime === '11:00' ? 'bg-[#005d8e] text-white' : isTimeAvailable('11:00') ? 'bg-gray-50 text-gray-800 hover:bg-blue-50' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={!isTimeAvailable('11:00')}
              >
                <span className="block font-medium text-inherit">11:00 AM</span>
                <span className="block text-xs mt-1 text-inherit">{isTimeAvailable('11:00') ? `to ${selectedActivity?.category === 'SCUBA' ? '12:30' : '12:00'} PM` : 'Unavailable'}</span>
                {!isTimeAvailable('11:00') && <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 rounded-md"><span className="text-xs font-medium text-gray-600">Unavailable</span></div>}
              </button>
              
              {/* Afternoon Times */}
              <button
                onClick={() => isTimeAvailable('12:00') && setStartTime('12:00')}
                className={`py-3 px-4 rounded-md text-center border border-gray-300 relative ${startTime === '12:00' ? 'bg-[#005d8e] text-white' : isTimeAvailable('12:00') ? 'bg-gray-50 text-gray-800 hover:bg-blue-50' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={!isTimeAvailable('12:00')}
              >
                <span className="block font-medium text-inherit">12:00 PM</span>
                <span className="block text-xs mt-1 text-inherit">{isTimeAvailable('12:00') ? `to ${selectedActivity?.category === 'SCUBA' ? '1:30' : '1:00'} PM` : 'Unavailable'}</span>
                {!isTimeAvailable('12:00') && <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 rounded-md"><span className="text-xs font-medium text-gray-600">Unavailable</span></div>}
              </button>
              
              <button
                onClick={() => isTimeAvailable('13:00') && setStartTime('13:00')}
                className={`py-3 px-4 rounded-md text-center border border-gray-300 relative ${startTime === '13:00' ? 'bg-[#005d8e] text-white' : isTimeAvailable('13:00') ? 'bg-gray-50 text-gray-800 hover:bg-blue-50' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={!isTimeAvailable('13:00')}
              >
                <span className="block font-medium text-inherit">1:00 PM</span>
                <span className="block text-xs mt-1 text-inherit">{isTimeAvailable('13:00') ? `to ${selectedActivity?.category === 'SCUBA' ? '2:30' : '2:00'} PM` : 'Unavailable'}</span>
                {!isTimeAvailable('13:00') && <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 rounded-md"><span className="text-xs font-medium text-gray-600">Unavailable</span></div>}
              </button>
              
              <button
                onClick={() => isTimeAvailable('14:00') && setStartTime('14:00')}
                className={`py-3 px-4 rounded-md text-center border border-gray-300 relative ${startTime === '14:00' ? 'bg-[#005d8e] text-white' : isTimeAvailable('14:00') ? 'bg-gray-50 text-gray-800 hover:bg-blue-50' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={!isTimeAvailable('14:00')}
              >
                <span className="block font-medium text-inherit">2:00 PM</span>
                <span className="block text-xs mt-1 text-inherit">{isTimeAvailable('14:00') ? `to ${selectedActivity?.category === 'SCUBA' ? '3:30' : '3:00'} PM` : 'Unavailable'}</span>
                {!isTimeAvailable('14:00') && <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 rounded-md"><span className="text-xs font-medium text-gray-600">Unavailable</span></div>}
              </button>
              
              <button
                onClick={() => isTimeAvailable('15:00') && setStartTime('15:00')}
                className={`py-3 px-4 rounded-md text-center border border-gray-300 relative ${startTime === '15:00' ? 'bg-[#005d8e] text-white' : isTimeAvailable('15:00') ? 'bg-gray-50 text-gray-800 hover:bg-blue-50' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={!isTimeAvailable('15:00')}
              >
                <span className="block font-medium text-inherit">3:00 PM</span>
                <span className="block text-xs mt-1 text-inherit">{isTimeAvailable('15:00') ? `to ${selectedActivity?.category === 'SCUBA' ? '4:30' : '4:00'} PM` : 'Unavailable'}</span>
                {!isTimeAvailable('15:00') && <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 rounded-md"><span className="text-xs font-medium text-gray-600">Unavailable</span></div>}
              </button>
              
              <button
                onClick={() => isTimeAvailable('16:00') && setStartTime('16:00')}
                className={`py-3 px-4 rounded-md text-center border border-gray-300 relative ${startTime === '16:00' ? 'bg-[#005d8e] text-white' : isTimeAvailable('16:00') ? 'bg-gray-50 text-gray-800 hover:bg-blue-50' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={!isTimeAvailable('16:00')}
              >
                <span className="block font-medium text-inherit">4:00 PM</span>
                <span className="block text-xs mt-1 text-inherit">{isTimeAvailable('16:00') ? `to ${selectedActivity?.category === 'SCUBA' ? '5:30' : '5:00'} PM` : 'Unavailable'}</span>
                {!isTimeAvailable('16:00') && <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 rounded-md"><span className="text-xs font-medium text-gray-600">Unavailable</span></div>}
              </button>
              
              <button
                onClick={() => isTimeAvailable('17:00') && setStartTime('17:00')}
                className={`py-3 px-4 rounded-md text-center border border-gray-300 relative ${startTime === '17:00' ? 'bg-[#005d8e] text-white' : isTimeAvailable('17:00') ? 'bg-gray-50 text-gray-800 hover:bg-blue-50' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={!isTimeAvailable('17:00')}
              >
                <span className="block font-medium text-inherit">5:00 PM</span>
                <span className="block text-xs mt-1 text-inherit">{isTimeAvailable('17:00') ? `to ${selectedActivity?.category === 'SCUBA' ? '6:30' : '6:00'} PM` : 'Unavailable'}</span>
                {!isTimeAvailable('17:00') && <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 rounded-md"><span className="text-xs font-medium text-gray-600">Unavailable</span></div>}
              </button>
              
              <button
                onClick={() => isTimeAvailable('18:00') && setStartTime('18:00')}
                className={`py-3 px-4 rounded-md text-center border border-gray-300 relative ${startTime === '18:00' ? 'bg-[#005d8e] text-white' : isTimeAvailable('18:00') ? 'bg-gray-50 text-gray-800 hover:bg-blue-50' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={!isTimeAvailable('18:00')}
              >
                <span className="block font-medium text-inherit">6:00 PM</span>
                <span className="block text-xs mt-1 text-inherit">{isTimeAvailable('18:00') ? `to ${selectedActivity?.category === 'SCUBA' ? '7:30' : '7:00'} PM` : 'Unavailable'}</span>
                {!isTimeAvailable('18:00') && <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 rounded-md"><span className="text-xs font-medium text-gray-600">Unavailable</span></div>}
              </button>
              
              <button
                onClick={() => isTimeAvailable('19:00') && setStartTime('19:00')}
                className={`py-3 px-4 rounded-md text-center border border-gray-300 relative ${startTime === '19:00' ? 'bg-[#005d8e] text-white' : isTimeAvailable('19:00') ? 'bg-gray-50 text-gray-800 hover:bg-blue-50' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                disabled={!isTimeAvailable('19:00')}
              >
                <span className="block font-medium text-inherit">7:00 PM</span>
                <span className="block text-xs mt-1 text-inherit">{isTimeAvailable('19:00') ? `to ${selectedActivity?.category === 'SCUBA' ? '8:30' : '8:00'} PM` : 'Unavailable'}</span>
                {!isTimeAvailable('19:00') && <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70 rounded-md"><span className="text-xs font-medium text-gray-600">Unavailable</span></div>}
              </button>
              

              
              {availableTimeSlots.length === 0 && (
                <div className="col-span-full p-4 text-center text-red-500">
                  No available time slots for this date. Please select another date.
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center bg-blue-50 rounded-md border border-blue-100">
              <div className="flex justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-blue-700 font-medium">Please select a date first to see available time slots.</p>
              <p className="text-blue-600 text-sm mt-2">Available hours: 7:00 AM - {selectedActivity?.category === 'SCUBA' ? '8:30' : '8:00'} PM (EST)</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!date || !startTime}
          className={`px-6 py-3 rounded-md text-white font-medium 
            ${date && startTime 
              ? 'bg-[#005d8e] hover:bg-[#00486e]' 
              : 'bg-gray-300 cursor-not-allowed'
            }`}
        >
          Continue
        </button>
      </div>
      
      {/* Hidden style to mark fully booked dates */}
      <style jsx global>{`
        /* Style for fully booked dates in the calendar */
        input[type="date"]::-webkit-calendar-picker-indicator {
          background-color: #fff;
          cursor: pointer;
        }
        
        /* Add custom styling for the date picker */
        input[type="date"]::-webkit-datetime-edit-text,
        input[type="date"]::-webkit-datetime-edit-month-field,
        input[type="date"]::-webkit-datetime-edit-day-field,
        input[type="date"]::-webkit-datetime-edit-year-field {
          color: #333;
        }
        
        /* We can't directly style the date picker days, but we can alert the user when they try to select a fully booked date */
      `}</style>
    </div>
  );
}
