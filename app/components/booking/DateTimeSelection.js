"use client";

import { useState, useEffect } from 'react';
import { availableTimes, getActivityEndTime } from '../../../data/booking-options';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DateTimeSelection({ 
  onSelectDateTime, 
  selectedBeach, 
  selectedActivity, 
  selectedDate,
  selectedTime
}) {
  // Use JS Date for react-datepicker - ensure proper date handling
  // Initialize with a function to avoid re-creating Date on every render unnecessarily.
  // Default to today if selectedDate prop is not provided.
  const [date, setDate] = useState(() => selectedDate ? new Date(selectedDate) : new Date());
  
  // Fix timezone issues by normalizing the date display
  const getFormattedDateString = (dateObj) => {
    if (!dateObj) return null;
    return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
  };
  const [startTime, setStartTime] = useState(selectedTime || '');
  const [availableTimeSlots, setAvailableTimeSlots] = useState(availableTimes);
  const [isLoading, setIsLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [unavailableTimes, setUnavailableTimes] = useState([]);
  const [fullyBookedDates, setFullyBookedDates] = useState([]); // array of YYYY-MM-DD strings
  // Helper to convert array of YYYY-MM-DD to JS Date objects
  const getDisabledDates = () => {
    // This function provides dates to the `excludeDates` prop of DatePicker.
    // `fullyBookedDates` are 'YYYY-MM-DD' strings. They need to be converted to JS Date objects.
    // Admin-blocked dates and other filtering are handled by the `filterDate` prop using `isDateBlocked`.
    // The `minDate` prop handles dates before today.
    // Lead time for the current day's *time slots* is handled by `fetchAvailability`.
    // This function should therefore primarily convert `fullyBookedDates` for `excludeDates`.
    const fullyBookedDateObjs = fullyBookedDates.map(dStr => {
      const [year, month, day] = dStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    });

    return fullyBookedDateObjs;
  };
  const [allBookings, setAllBookings] = useState({});

  // Effect to synchronize the internal 'date' state with the 'selectedDate' prop from the parent.
  // This is crucial if the parent component changes the desired selected date after initial mount.
  useEffect(() => {
    const newDateFromProp = selectedDate ? new Date(selectedDate) : new Date(); // Default to today if prop becomes null/undefined
    // Only update if the date string is different to avoid potential loops with date objects.
    if (date.toDateString() !== newDateFromProp.toDateString()) {
      setDate(newDateFromProp);
    }
  }, [selectedDate]); // Deliberately not including 'date' in deps to avoid loops; selectedDate is the source of truth.

  // Calculate minimum date (today)
  const today = new Date();
  const minDate = today;

  // Booking settings state
  const [bookingSettings, setBookingSettings] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [leadTimeHours, setLeadTimeHours] = useState(0);

  // Calculate maximum date (6 months from now)
  const sixMonthsLater = new Date(today);
  sixMonthsLater.setMonth(today.getMonth() + 6);
  const maxDate = sixMonthsLater; // JS Date

  // Fetch booking settings for the selected beach
  useEffect(() => {
    if (!selectedBeach) return;
    fetch(`/api/booking-settings?site=${encodeURIComponent(selectedBeach.name)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings.length > 0) {
          setBookingSettings(data.settings[0]);
          setBlockedDates(data.settings[0].blockedDates || []);
          setLeadTimeHours(data.settings[0].leadTimeHours || 0);
          // Force re-render of the date picker when lead time changes (Commented out to prevent date reset on beach change)
          // setDate(null);
          // setDate(new Date());
        } else {
          setBookingSettings(null);
          setBlockedDates([]);
          setLeadTimeHours(0);
        }
      });
  }, [selectedBeach]);

  // Fetch bookings only when necessary components change
  // Effect to reset startTime when primary context (date, activity, beach) changes
  useEffect(() => {
    setStartTime('');
  }, [date, selectedActivity, selectedBeach]);

  // Main effect for fetching/calculating availability
  useEffect(() => {
    // Resetting these are fine as they are recalculated based on the current context
    setAvailableTimeSlots(availableTimes); // Or derive from activity if it can change
    setUnavailableTimes([]);
    setBookedSlots([]);
    // DO NOT reset startTime here unconditionally, it's handled by the effect above

    // Only fetch if we have all required data, including bookingSettings and selectedActivity
    if (selectedBeach && selectedActivity && date && bookingSettings) {
      fetchAvailability(); // Assuming fetchAllBookings was renamed to fetchAvailability
    }
    // Ensure date object changes trigger this, and bookingSettings being loaded is critical.
  }, [selectedBeach, selectedActivity, date, bookingSettings]);
  
  // Don't need a separate effect for date changes as it's included above

  // Always merge blockedDates into fullyBookedDates
  useEffect(() => {
    setFullyBookedDates(prev => {
      // Merge and deduplicate
      const set = new Set([...(prev || []), ...(blockedDates || [])]);
      return Array.from(set);
    });
  }, [blockedDates]);
  
  // Fetch all bookings to determine which dates are fully booked
  const fetchAllBookings = async () => {
    try {
      // Only fetch bookings if a date is provided (prevents 400 errors)
      if (!date) return;
      const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : date;
      const response = await fetch(`/api/bookings?date=${formattedDate}`);
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
  
  // Check which dates are fully booked or blocked
  const checkForFullyBookedDates = (bookingsByDate) => {
    if (!selectedBeach || !selectedActivity) return;
    
    const newFullyBookedDates = new Set([...(blockedDates || [])]);
    
    // For each date with bookings
    Object.keys(bookingsByDate).forEach(date => {
      // First filter bookings for this beach
      const bookingsForBeach = bookingsByDate[date].filter(
        booking => booking.beach === selectedBeach.name
      );
      
      // Then check if there are any bookings for each time slot at this beach
      if (bookingsForBeach.length > 0) {
        // Check if any time slot is still available
        let allSlotsBooked = true;
        
        availableTimes.some(time => {
          // Calculate end time based on activity duration
          const endTime = getActivityEndTime(time, selectedActivity.duration);
          
          // Check if this time slot overlaps with any booked slots
          const isUnavailable = bookingsForBeach.some(booking => {
            return (
              (time >= booking.startTime && time < booking.endTime) || // Start time within booked slot
              (endTime > booking.startTime && endTime <= booking.endTime) || // End time within booked slot
              (time <= booking.startTime && endTime >= booking.endTime) // Completely contains booked slot
            );
          });
          
          // If we found at least one available slot, not all slots are booked
          if (!isUnavailable) {
            allSlotsBooked = false;
            return true; // stop the loop
          }
          
          return false;
        });
        
        // If all slots are booked, add this date to the fully booked dates
        if (allSlotsBooked) {
          newFullyBookedDates.add(date);
        }
      }
    });
    
    // Update state with fully booked dates
    setFullyBookedDates(Array.from(newFullyBookedDates));
  };
  
  // Helper to get minimum selectable date based on lead time
  const getLeadTimeMinDate = () => {
    const leadDate = new Date();
    if (leadTimeHours > 0) {
      leadDate.setHours(leadDate.getHours() + leadTimeHours);
      // Set to start of day
      leadDate.setHours(0, 0, 0, 0);
    }
    return leadDate.toISOString().split('T')[0];
  };
  
  // Disable blocked dates and dates within lead time
  function isDateBlocked(dateStr) {
    if (blockedDates.includes(dateStr)) return true;
    const minAllowed = getLeadTimeMinDate();
    return dateStr < minAllowed;
  }

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
      const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : date;
    const response = await fetch(`/api/bookings?date=${formattedDate}`);
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
        
        // Add logic to check against current time and lead time for the selected date
        const now = new Date();
        const currentLeadTimeHoursValue = leadTimeHours || 0; // leadTimeHours is from state
        const leadTimeCutoff = new Date(now.getTime() + currentLeadTimeHoursValue * 60 * 60 * 1000);
        
        // 'date' is the selectedDate from state (which should be a JS Date object)
        const selectedDateObject = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Normalize to start of day for comparison

        const todayDateObject = new Date();
        todayDateObject.setHours(0,0,0,0); // Normalize to start of day

        // Iterate over all potentially available system times, not just those filtered by bookings
        availableTimes.forEach(slot => {
          const [slotHours, slotMinutes] = slot.split(':').map(Number);
          const slotDateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), slotHours, slotMinutes, 0, 0);

          let shouldBeUnavailableDueToTime = false;

          if (selectedDateObject.getTime() < todayDateObject.getTime()) {
            // Selected date is in the past (DatePicker should prevent this, but good to be robust)
            shouldBeUnavailableDueToTime = true;
          } else if (selectedDateObject.getTime() === todayDateObject.getTime()) {
            // Selected date is today, check against now and leadTimeCutoff
            if (slotDateTime < now || slotDateTime < leadTimeCutoff) {
              shouldBeUnavailableDueToTime = true;
            }
          }
          // For future dates, DatePicker's lead time filter for full days handles broad lead times.
          // This logic ensures slot-level precision, especially for lead times < 24h affecting today.

          if (shouldBeUnavailableDueToTime) {
            if (!unavailable.includes(slot)) { // Add to unavailable list if not already there
              unavailable.push(slot);
            }
          }
        });

        setUnavailableTimes(unavailable);
        // Filter the master list of 'availableTimes' by the now-updated 'unavailable' list
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
      // Format date as YYYY-MM-DD - using our consistent date formatter
      const formattedDate = getFormattedDateString(date);
      // If activity has duration, calculate endTime
      let endTime = null;
      if (selectedActivity && selectedActivity.duration) {
        const [hour, minute] = startTime.split(':');
        const startDate = new Date(date);
        startDate.setHours(Number(hour));
        startDate.setMinutes(Number(minute));
        const endDate = new Date(startDate.getTime() + selectedActivity.duration * 60000);
        endTime = endDate.toTimeString().slice(0,5);
      }
      onSelectDateTime(formattedDate, startTime, endTime);
    }
  };

  // Helper: check if a time slot is available
  const isTimeAvailable = (time) => !unavailableTimes.includes(time);

  // Convert 'HH:mm' to 12-hour format with AM/PM
  const formatTimeLabel = (time) => {
    const [hour, minute] = time.split(':');
    const dateObj = new Date();
    dateObj.setHours(Number(hour));
    dateObj.setMinutes(Number(minute));
    return dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  // Returns end time in 12-hour format
  const getActivityEndTimeLabel = (time) => {
    if (!selectedActivity || !selectedActivity.duration) return '';
    const [hour, minute] = time.split(':');
    const startDate = new Date();
    startDate.setHours(Number(hour));
    startDate.setMinutes(Number(minute));
    const endDate = new Date(startDate.getTime() + selectedActivity.duration * 60000);
    return endDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  // Format the selected date directly to avoid any string conversion issues
  const formatDateDisplay = (dateObj) => {
    if (!dateObj) return '';
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString(undefined, options);
  };

  // MAIN RETURN BLOCK (always render booking calendar UI)
  // Check if the selected date is blocked - ensure consistent date string format
  const dateStr = date ? getFormattedDateString(date) : null;
  const isBlockedDate = dateStr && fullyBookedDates.includes(dateStr);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Date and Time Selection */}

      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100">
        {/* Calendar and Time Selection in side-by-side layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Date Selection - Left Column */}
          <div className="lg:w-1/2">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Select Date</h2>
            <div className="mb-3">
              <DatePicker
                selected={date}
                onChange={d => { 
                  // Ensure date is properly set without timezone issues
                  const selectedDate = new Date(d);
                  // Reset hours to avoid any time-related issues
                  selectedDate.setHours(0,0,0,0);
                  setDate(selectedDate); 
                  setStartTime(''); 
                }}
                minDate={minDate}
                maxDate={maxDate}
                excludeDates={getDisabledDates()}
                dateFormat="MMMM d, yyyy"
                className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#005d8e] focus:border-[#005d8e]"
                placeholderText="Select a date"
                required
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                calendarClassName="date-picker-calendar"
                inline
                calendarStartDay={1}
              />
            </div>
            {date && (
              <div className="mt-2 p-2 bg-blue-50 rounded-md border-l-4 border-blue-400">
                <p className="text-blue-700 font-medium text-sm">{formatDateDisplay(date)}</p>
              </div>
            )}
          </div>

          {/* Time Selection - Right Column */}
          <div className="lg:w-1/2 mt-4 lg:mt-0">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Select Time <span className="text-xs font-normal text-gray-500">(EST)</span></h2>
            
            {isBlockedDate ? (
              <div className="p-3 text-center bg-red-50 rounded-md border border-red-200 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-red-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 font-semibold text-base">This date is not available for booking</p>
                <p className="text-red-500 mt-0.5 text-sm">Please select another date from the calendar</p>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center items-center h-32 bg-gray-50 rounded-md">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005d8e]"></div>
                  <p className="mt-2 text-gray-600 text-sm">Loading available times...</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg py-2 px-2 h-full">
                {availableTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2">
                    {availableTimeSlots.map((time) => {
                      const isAvailable = isTimeAvailable(time);
                      const isSelected = startTime === time;
                      const timeLabel = formatTimeLabel(time);
                      const endTimeLabel = getActivityEndTimeLabel(time);
                      
                      return (
                        <div key={time} className="relative">
                          <button
                            onClick={() => isAvailable && setStartTime(time)}
                            className={`
                              w-full py-2 px-1 rounded text-center border transition-all duration-200
                              ${isSelected ? 'bg-[#005d8e] text-white border-[#003f5f] shadow-sm' : ''}
                              ${isAvailable && !isSelected ? 'bg-white border-gray-200 hover:border-[#005d8e] hover:bg-blue-50' : ''}
                              ${!isAvailable ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : ''}
                              focus:outline-none focus:ring-1 focus:ring-[#005d8e] focus:ring-opacity-50
                            `}
                            disabled={!isAvailable}
                            aria-label={`Select time slot at ${timeLabel}`}
                          >
                            <div className="flex flex-col items-center">
                              <span className={`text-base font-medium ${isSelected ? 'text-white' : isAvailable ? 'text-gray-800' : 'text-gray-400'}`}>
                                {timeLabel}
                              </span>
                              <span className={`text-xs ${isSelected ? 'text-blue-100' : isAvailable ? 'text-gray-500' : 'text-gray-400'}`}>
                                {isAvailable ? `to ${endTimeLabel}` : 'Unavailable'}
                              </span>
                            </div>
                          </button>
                          
                          {/* Selected indicator */}
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5" aria-hidden="true">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-4 px-3 text-center bg-yellow-50 rounded-md border border-yellow-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-yellow-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-yellow-800 font-semibold text-base">No available time slots</p>
                    <p className="text-yellow-700 mt-0.5 text-sm">Please select another date from the calendar</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      {!isBlockedDate && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!date || !startTime}
            className={`
              px-5 py-2 rounded text-white font-medium text-base transition-all duration-200
              ${date && startTime ? 'bg-[#005d8e] hover:bg-[#00486e] shadow-sm' : 'bg-gray-300 cursor-not-allowed'}
            `}
            aria-disabled={!date || !startTime}
          >
            Continue
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <style jsx global>{`
        .react-datepicker {
          font-family: inherit;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }
        .react-datepicker__header {
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          padding-top: 12px;
          padding-bottom: 8px;
        }
        .react-datepicker__day--selected {
          background-color: #005d8e !important;
          border-radius: 50%;
        }
        .react-datepicker__day:hover {
          background-color: #e0f2fe !important;
          border-radius: 50%;
        }
        .react-datepicker__day--disabled {
          color: #d1d5db !important;
          text-decoration: line-through;
        }
        .react-datepicker__day {
          border-radius: 50%;
          margin: 0.15rem;
          padding: 0.3rem;
          width: 1.7rem;
          height: 1.7rem;
          line-height: 1.1rem;
        }
        .react-datepicker__day-name {
          width: 1.7rem;
          margin: 0.15rem;
        }
        .react-datepicker__day--outside-month {
          color: #9ca3af;
        }
        .react-datepicker__navigation {
          top: 12px;
        }
        .react-datepicker__current-month {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .date-picker-calendar {
          width: 100%;
          max-width: 350px;
          margin: 0 auto;
        }
        @media (max-width: 640px) {
          .react-datepicker__day {
            width: 1.5rem;
            height: 1.5rem;
            line-height: 0.9rem;
            margin: 0.1rem;
            padding: 0.3rem;
          }
          .react-datepicker__day-name {
            width: 1.5rem;
            margin: 0.1rem;
          }
        }
      `}</style>
    </div>
  );
}
