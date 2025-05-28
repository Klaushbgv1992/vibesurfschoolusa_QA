"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from 'next/navigation';
import { activities } from '../../../data/booking-options';
import BookingSettingsPanel from './BookingSettingsPanel';
import AdminNavbar from '../components/AdminNavbar';
import MessagesPanel from '../components/MessagesPanel';
import MessagesInbox from '../components/MessagesInbox';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const fetchBookings = async (start, end) => {
  try {
    // Use window.location.origin to ensure we have the full URL
    const apiUrl = `${window.location.origin}/api/bookings?start=${start}&end=${end}`;
    console.log('Fetching bookings from:', apiUrl);
    
    // Fetch all bookings within the calendar range
    const response = await fetch(apiUrl, {
      credentials: 'same-origin',
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    if (data.success) {
      return data.bookings;
    }
    return [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    // Return empty array on error to prevent UI from breaking
    return [];
  }
};

export default function AdminBookingsPage() {
  const router = useRouter();

  // For demonstration, use static list of sites. You can fetch dynamically if you wish.
  const sites = [
    'Pompano Beach',
    'Sunny Isles Beach',
    'Dania Beach',
  ];
  // Replace single selection with multi-select object where each beach is a key with boolean value
  const [selectedBeaches, setSelectedBeaches] = useState(
    sites.reduce((acc, site) => {
      acc[site] = true; // Set all sites to true (selected) by default
      return acc;
    }, {})
  );
  const [allBlockedDates, setAllBlockedDates] = useState([]); // New state for all blocked dates
  const [activeTab, setActiveTab] = useState('calendar');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const fetchedDatesRef = useRef({}); // To track fetched date ranges for bookings
  const calendarRef = useRef(null); // Define calendarRef for FullCalendar

  // State for the new booking modal
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [selectedDateForNewBooking, setSelectedDateForNewBooking] = useState(null);
  const [newBookingClientName, setNewBookingClientName] = useState('');
  const [newBookingClientEmail, setNewBookingClientEmail] = useState('');
  const [newBookingClientPhone, setNewBookingClientPhone] = useState('');
  const [newBookingBeach, setNewBookingBeach] = useState(sites[0] || '');
  const [newBookingActivityId, setNewBookingActivityId] = useState(activities[0]?.id || '');
  const [newBookingStartTime, setNewBookingStartTime] = useState('09:00');
  const [newBookingEndTime, setNewBookingEndTime] = useState('10:00');
  const [newBookingParticipants, setNewBookingParticipants] = useState(1);
  const [newBookingNotes, setNewBookingNotes] = useState('');
  const [newBookingStatus, setNewBookingStatus] = useState('Confirmed'); // Default for admin
  const paymentMethodOptions = ['Pending', 'Cash', 'Zelle', 'Venmo', 'PayPal (Manual)', 'Card (Manual)'];
  const [newBookingPaymentMethod, setNewBookingPaymentMethod] = useState(paymentMethodOptions[0]);
  const [newBookingRevenue, setNewBookingRevenue] = useState(''); // State for new booking revenue

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('vibeAdminAuth') === 'true';
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchAndSetBlockedDates = useCallback(async (currentSelectedBeaches) => {
    const activeBeaches = Object.entries(currentSelectedBeaches)
      .filter(([, isSelected]) => isSelected)
      .map(([beachName]) => beachName);

    if (activeBeaches.length === 0) {
      setAllBlockedDates([]);
      return;
    }
    console.log('[AdminBookingsPage] Fetching blocked dates for:', activeBeaches.join(', '));
    try {
      const promises = activeBeaches.map(async (beachName) => {
        const apiUrl = `${window.location.origin}/api/booking-settings?site=${encodeURIComponent(beachName)}`;
        const response = await fetch(apiUrl, { cache: 'no-cache' });
        if (!response.ok) {
          console.error(`[AdminBookingsPage] Failed to fetch settings for ${beachName}: ${response.status}`);
          return [];
        }
        const data = await response.json();
        if (data.success && data.settings.length > 0 && data.settings[0].blockedDates) {
          return data.settings[0].blockedDates;
        }
        return [];
      });

      const results = await Promise.all(promises);
      const combinedBlockedDates = new Set();
      results.forEach(datesArray => {
        if (Array.isArray(datesArray)) {
          datesArray.forEach(dateStr => combinedBlockedDates.add(dateStr));
        }
      });
      const newBlockedDates = Array.from(combinedBlockedDates);
      console.log('[AdminBookingsPage] Combined blocked dates:', newBlockedDates);
      setAllBlockedDates(newBlockedDates);
    } catch (error) {
      console.error('[AdminBookingsPage] Error fetching combined blocked dates:', error);
      setAllBlockedDates([]);
    }
  }, [setAllBlockedDates]);

  useEffect(() => {
    if (localStorage.getItem('vibeAdminAuth') === 'true') {
        fetchAndSetBlockedDates(selectedBeaches);
    }
  }, [selectedBeaches, fetchAndSetBlockedDates]);
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [calendarViewDates, setCalendarViewDates] = useState({ start: '', end: '' });
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [editRevenue, setEditRevenue] = useState(null);
  const [isSavingRevenue, setIsSavingRevenue] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleStartTime, setRescheduleStartTime] = useState('');
  const [rescheduleEndTime, setRescheduleEndTime] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to check if a booking is a 5+ group lesson that has special revenue handling
  const isGroupLesson = (booking) => {
    const activity = booking.activity?.name || booking.activity || '';
    // Only treat 5+ People Group lessons as special group lessons with custom revenue
    return activity.toLowerCase().includes('5+');
  };

  // Helper to get latest price for an activity name or id
  const getActivityPrice = (booking) => {
    if (isGroupLesson(booking)) return booking.revenue || 0;
    // Try to match by id or name
    let act = null;
    if (booking.activity && typeof booking.activity === 'object') {
      act = activities.find(a => a.id === booking.activity.id || a.name === booking.activity.name);
    } else {
      act = activities.find(a => a.name === booking.activity || a.id === booking.activity);
    }
    if (!act) return 0;
    return act.price * (parseInt(booking.participants) || 1);
  };

  const getDayCellClassNames = useCallback((arg) => {
    const dateStr = arg.date.toISOString().split('T')[0];
    if (allBlockedDates.includes(dateStr)) {
      return ['blocked-date-cell'];
    }
    return [];
  }, [allBlockedDates]);

  // Function to fetch unread messages count
  const fetchUnreadMessagesCount = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/messages?unreadOnly=true', {
        credentials: 'same-origin',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setUnreadMessages(data.messages.length);
      }
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  }, []);

  // Fetch unread messages periodically
  useEffect(() => {
    // Fetch immediately on mount
    fetchUnreadMessagesCount();
    
    // Then set up interval to check every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadMessagesCount();
    }, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [fetchUnreadMessagesCount]);
  
  // useEffect to refetch calendar events when date range or beach selection changes
  useEffect(() => {
    if (calendarRef.current) {
        console.log('[useEffect for date/beach change] Triggering refetchEvents. ViewDates:', calendarViewDates, 'SelectedBeaches:', selectedBeaches);
        calendarRef.current.getApi().refetchEvents();
    }
  }, [calendarViewDates, selectedBeaches]);

  const fetchCalendarEvents = useCallback(async (fetchInfo, successCallback, failureCallback) => {
    console.log('[fetchCalendarEvents] Fetching for range:', fetchInfo.startStr, fetchInfo.endStr);
    console.log('[fetchCalendarEvents] Current selectedBeaches:', selectedBeaches);
    try {
      const rawBookings = await fetchBookings(fetchInfo.startStr, fetchInfo.endStr);

      const currentSelectedBeaches = selectedBeaches; // Use the state directly
      const activeBeachesList = sites.filter(site => currentSelectedBeaches[site]);
      
      console.log('[fetchCalendarEvents] Active beaches for filtering:', activeBeachesList);

      const filteredBookings = rawBookings.filter(b => {
        const beachName = typeof b.beach === 'object' ? b.beach?.name : b.beach;
        if (activeBeachesList.length === 0 && sites.length > 0) {
            return false;
        }
        if (sites.length === 0) {
            return true;
        }
        return activeBeachesList.includes(beachName);
      });
      
      console.log('[fetchCalendarEvents] Raw bookings:', rawBookings.length, 'Filtered bookings:', filteredBookings.length);

      const evts = filteredBookings.map(b => {
        const id = b._id ? (typeof b._id === 'object' && b._id.toString ? b._id.toString() : String(b._id)) : String(Math.random());
        return {
          id: id,
          title: `${b.activity?.name || b.activity} - ${typeof b.beach === 'object' ? b.beach?.name : b.beach || 'No Beach'} (${b.clientName})`,
          start: b.date ? new Date(b.date).toISOString().split('T')[0] + 'T' + (b.startTime || '09:00') : undefined,
          end: b.date ? new Date(b.date).toISOString().split('T')[0] + 'T' + (b.endTime || '10:00') : undefined,
          extendedProps: {...b, _id: id},
          color: b.status === 'Confirmed' ? '#198754' : (b.status === 'Pending' ? '#ffc107' : '#6c757d'),
        };
      });
      successCallback(evts);

      const total = filteredBookings.reduce((sum, b) => sum + getActivityPrice(b), 0);
      setRevenueTotal(total);
      console.log('[fetchCalendarEvents] Events processed:', evts.length, 'New revenue total:', total);

    } catch (error) {
      console.error('Error in fetchCalendarEvents:', error);
      failureCallback(error);
      setRevenueTotal(0);
      successCallback([]);
    }
  }, [selectedBeaches, sites, getActivityPrice, setRevenueTotal, calendarViewDates]); // Added calendarViewDates as it's used in console log indirectly via useEffect trigger

  // Function to handle booking deletion
  const handleDeleteBooking = async () => {
    if (!selectedBooking?._id) return;
    
    setIsProcessing(true);
    try {
      // Use window.location.origin to ensure we have the full URL
      const apiUrl = `${window.location.origin}/api/bookings?id=${selectedBooking._id}`;
      console.log('Making DELETE request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        // Add these options to help with potential CORS or cache issues
        credentials: 'same-origin',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the calendar to reflect the deleted booking
        if (calendarRef.current) {
          calendarRef.current.getApi().refetchEvents();
        }
        // Close the modal
        setSelectedBooking(null);
        setIsDeleting(false);
      } else {
        alert(`Error: ${data.message || 'Could not delete booking'}`);
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert(`Failed to delete booking: ${error.message}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to handle booking rescheduling
  const handleRescheduleBooking = async () => {
    if (!selectedBooking?._id || !rescheduleDate || !rescheduleStartTime || !rescheduleEndTime) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsProcessing(true);
    try {
      // Use window.location.origin to ensure we have the full URL
      const apiUrl = `${window.location.origin}/api/bookings`;
      console.log('Making PATCH request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedBooking._id,
          date: rescheduleDate,
          startTime: rescheduleStartTime,
          endTime: rescheduleEndTime
        }),
        // Add these options to help with potential CORS or cache issues
        credentials: 'same-origin',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the calendar to reflect the rescheduled booking
        await refreshBookings();
        
        // Close the modal and reset rescheduling state
        setSelectedBooking(null);
        setIsRescheduling(false);
        setRescheduleDate('');
        setRescheduleStartTime('');
        setRescheduleEndTime('');
      } else {
        alert(`Error: ${data.message || 'Could not reschedule booking'}`);
      }
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      alert(`Failed to reschedule booking: ${error.message}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle date range change in calendar with debounce
  const handleDatesSet = useCallback((arg) => {
    // Reset our fetched dates tracking when calendar view changes
    fetchedDatesRef.current = {};
    
    setCalendarViewDates({
      start: arg.startStr.split('T')[0],
      end: arg.endStr.split('T')[0],
    });
  }, []);
  

  // Handle event click
  const handleEventClick = async (clickInfo) => {
    try {
      // Get the booking ID from the event
      const bookingId = clickInfo.event.id;
      
      // Instead of relying solely on extendedProps which might be stale,
      // fetch the latest booking data from the API
      const response = await fetch(`/api/bookings?id=${bookingId}`);
      const data = await response.json();
      
      if (data.success && data.booking) {
        // Use the freshly fetched booking data
        setSelectedBooking(data.booking);
        setEditRevenue(data.booking.revenue !== undefined ? String(data.booking.revenue) : null); // Initialize editRevenue
      } else {
        // Fallback to the data we have in the event props
        const bookingProps = clickInfo.event.extendedProps;
        setSelectedBooking(bookingProps);
        setEditRevenue(bookingProps.revenue !== undefined ? String(bookingProps.revenue) : null); // Initialize editRevenue from props
        console.warn('Using cached booking data, could not fetch latest');
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      // Fallback to the data we have in the event props
      setSelectedBooking(clickInfo.event.extendedProps);
    }
  };

  const handleDateClick = (info) => {
    setSelectedDateForNewBooking(info.dateStr);
    // Reset form fields when opening modal for a new booking
    setNewBookingClientName('');
    setNewBookingClientEmail('');
    setNewBookingClientPhone('');
    setNewBookingBeach(sites[0] || '');
    setNewBookingActivityId(activities[0]?.id || '');
    setNewBookingStartTime('09:00');
    setNewBookingEndTime('10:00');
    setNewBookingParticipants(1);
    setNewBookingNotes('');
    setNewBookingStatus('Confirmed');
    setNewBookingRevenue(''); // Reset revenue field
    setIsNewBookingModalOpen(true);
  };

  const handleSaveNewBooking = async () => {
  console.log('[handleSaveNewBooking] Function start. typeof calendarRef:', typeof calendarRef, 'calendarRef itself:', calendarRef);
    if (!selectedDateForNewBooking || !newBookingActivityId || !newBookingBeach) {
      alert('Please ensure date, activity, and beach are selected.');
      return;
    }

    const activityDetails = activities.find(act => act.id === newBookingActivityId);
    if (!activityDetails) {
        alert('Selected activity not found.');
        return;
    }

    const bookingData = {
      clientName: newBookingClientName,
      clientEmail: newBookingClientEmail,
      clientPhone: newBookingClientPhone,
      beach: newBookingBeach,
      activity: activityDetails.name, // Send activity name as per current API expectation
      activityId: newBookingActivityId, // Send activity ID for consistency
      date: selectedDateForNewBooking,
      startTime: newBookingStartTime,
      endTime: newBookingEndTime,
      participants: parseInt(newBookingParticipants, 10),
      notes: newBookingNotes,
      revenue: newBookingRevenue !== '' ? parseFloat(newBookingRevenue) : undefined, // Add revenue to booking details
      status: newBookingStatus,
      paymentMethod: newBookingPaymentMethod,
      paymentDetails: {
        status: newBookingPaymentMethod === 'Pending' ? 'PENDING' : 'COMPLETED',
        source: 'AdminManualEntry',
        method: newBookingPaymentMethod // Store the explicitly chosen method
      }
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Booking created successfully!');
        setIsNewBookingModalOpen(false);
        // Refresh calendar events
        console.log('[handleSaveNewBooking] Debugging calendarRef:', typeof calendarRef, calendarRef);
        if (calendarRef && calendarRef.current) {
          calendarRef.current.getApi().refetchEvents();
        } else {
          console.warn('calendarRef.current is not available to refetch events. Forcing a page reload to show new booking.');
          window.location.reload(); // Fallback: reload the page if ref is not available
        }
      } else {
        alert(`Failed to create booking: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(`Error creating booking: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6">
          <button
            className={`px-6 py-3 font-medium rounded-md shadow-sm ${activeTab === 'calendar' ? 'bg-gradient-to-r from-blue-700 to-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
            onClick={() => setActiveTab('calendar')}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </div>
          </button>
          <button
            className={`px-6 py-3 font-medium rounded-md shadow-sm ${activeTab === 'messages' ? 'bg-gradient-to-r from-blue-700 to-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'} relative`}
            onClick={() => {
              setActiveTab('messages');
              // Reset unread count when switching to messages tab
              if (unreadMessages > 0) {
                setUnreadMessages(0);
              }
            }}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Messages
              
              {unreadMessages > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {unreadMessages}
                </div>
              )}
            </div>
          </button>
        </div>

        {activeTab === 'calendar' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Bookings Calendar</h1>
              <div className="bg-white rounded-lg shadow-sm p-3 flex items-center">
                <div className="flex items-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-gray-700">Revenue:</span>
                </div>
                <span className="text-xl font-bold text-green-700">{revenueTotal.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                ref={calendarRef} // Add ref for calendar operations
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                height="auto"
                events={fetchCalendarEvents}
                datesSet={handleDatesSet}
                dayCellClassNames={getDayCellClassNames}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                dayMaxEvents={3}
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  meridiem: 'short'
                }}
                eventDisplay="block"
                buttonText={{
                  today: 'Today',
                  month: 'Month',
                  week: 'Week',
                  day: 'Day'
                }}
                titleFormat={{ year: 'numeric', month: 'long' }}
              />
            </div>

            {/* Beach selection filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h3 className="font-semibold text-gray-800 text-lg">Filter by location</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {sites.map(site => (
                  <label key={site} className={`flex items-center px-3 py-2 rounded-full cursor-pointer transition-colors ${selectedBeaches[site] ? 'bg-blue-100 border border-blue-300' : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'}`}>
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                      checked={selectedBeaches[site]}
                      onChange={() => {
                        setSelectedBeaches(prev => ({
                          ...prev,
                          [site]: !prev[site],
                        }));
                      }}
                    />
                    <span className="text-sm font-medium">{site}</span>
                  </label>
                ))}
                <button
                  className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-full text-gray-800 text-sm font-medium hover:bg-gray-200 transition-colors flex items-center"
                  onClick={() => {
                    const allSelected = Object.values(selectedBeaches).every(Boolean);
                    const newValue = !allSelected;
                    const newState = {};
                    sites.forEach(site => {
                      newState[site] = newValue;
                    });
                    setSelectedBeaches(newState);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {Object.values(selectedBeaches).every(Boolean) ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    )}
                  </svg>
                  {Object.values(selectedBeaches).every(Boolean) ? 'Unselect All' : 'Select All'}
                </button>
              </div>
            </div>

            {/* Booking Settings Panel at bottom */}
            <BookingSettingsPanel
            onSettingsChange={() => {
              console.log('[AdminBookingsPage] Settings changed in panel, refetching blocked dates.');
              fetchAndSetBlockedDates(selectedBeaches);
            }} sites={sites.filter(site => selectedBeaches[site])} selectedBeaches={selectedBeaches} />

            {/* Booking Details Modal */}
            {selectedBooking && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg min-w-[450px] max-w-[90vw]">
                  {/* Reschedule Mode */}
                  {isRescheduling ? (
                    <div>
                      <h2 className="text-lg font-bold mb-4">Reschedule Booking</h2>
                      <div className="mb-4 grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">New Date:</label>
                          <input
                            type="date"
                            className="w-full p-2 border rounded"
                            value={rescheduleDate}
                            onChange={(e) => setRescheduleDate(e.target.value)}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Start Time:</label>
                            <input
                              type="time"
                              className="w-full p-2 border rounded"
                              value={rescheduleStartTime}
                              onChange={(e) => setRescheduleStartTime(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">End Time:</label>
                            <input
                              type="time"
                              className="w-full p-2 border rounded"
                              value={rescheduleEndTime}
                              onChange={(e) => setRescheduleEndTime(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                          onClick={() => setIsRescheduling(false)}
                          disabled={isProcessing}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                          onClick={handleRescheduleBooking}
                          disabled={isProcessing || !rescheduleDate || !rescheduleStartTime || !rescheduleEndTime}
                        >
                          {isProcessing ? 'Processing...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  ) : isDeleting ? (
                    /* Delete Confirmation Mode */
                    <div>
                      <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                      <p className="mb-6">
                        Are you sure you want to delete this booking for{' '}
                        <b>{selectedBooking.clientName}</b> on{' '}
                        <b>{new Date(selectedBooking.date).toLocaleDateString()}</b>?
                      </p>
                      <div className="flex justify-end space-x-2">
                        <button
                          className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                          onClick={() => setIsDeleting(false)}
                          disabled={isProcessing}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                          onClick={handleDeleteBooking}
                          disabled={isProcessing}
                        >
                          {isProcessing ? 'Processing...' : 'Delete Booking'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Default View Mode */
                    <>
                      <h2 className="text-lg font-bold mb-2">Booking Details</h2>
                      <div className="mb-2">
                        <b>Client:</b> {selectedBooking.clientName}
                      </div>
                      <div className="mb-2">
                        <b>Email:</b> {selectedBooking.clientEmail}
                      </div>
                      <div className="mb-2">
                        <b>Phone:</b> {selectedBooking.clientPhone}
                      </div>
                      <div className="mb-2">
                        <b>Activity:</b> {selectedBooking.activity?.name || selectedBooking.activity}
                      </div>
                      <div className="mb-2">
                        <b>Beach:</b>{' '}
                        {typeof selectedBooking.beach === 'object'
                          ? selectedBooking.beach?.name
                          : selectedBooking.beach || 'Not specified'}
                      </div>
                      <div className="mb-2">
                        <b>Date:</b> {new Date(selectedBooking.date).toLocaleDateString()}
                      </div>
                      <div className="mb-2">
                        <b>Time:</b> {selectedBooking.startTime} - {selectedBooking.endTime}
                      </div>
                      <div className="mb-2">
                        <b>Status:</b> {selectedBooking.status}
                      </div>
                      <div className="mb-2">
                        <b>Participants:</b> {selectedBooking.participants}
                      </div>
                      {selectedBooking.groupAges && (
                        <div className="mb-2">
                          <b>Group Ages:</b> {selectedBooking.groupAges}
                        </div>
                      )}
                      {selectedBooking.notes && (
                        <div className="mb-2">
                          <b>Notes:</b> {selectedBooking.notes}
                        </div>
                      )}

                      {/* Revenue Field: Always Editable */}
                      <div className="mb-2">
                        <b>Revenue:</b>
                        <input
                          type="number"
                          className="border px-2 py-1 rounded w-24 ml-2 mr-2"
                          value={editRevenue !== null ? editRevenue : (selectedBooking.revenue !== undefined ? String(selectedBooking.revenue) : '0')}
                          min="0"
                          step="0.01"
                          onChange={(e) => setEditRevenue(e.target.value)} // Store as string
                          placeholder="0.00"
                        />
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                          disabled={isSavingRevenue || (editRevenue === null || parseFloat(editRevenue) === (selectedBooking.revenue !== undefined ? selectedBooking.revenue : 0))}
                          onClick={async () => {
                            setIsSavingRevenue(true);
                            const revenueToSave = editRevenue !== null && editRevenue.trim() !== '' ? parseFloat(editRevenue) : 0;
                            await fetch('/api/bookings', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: selectedBooking._id, revenue: revenueToSave }),
                            });
                            setIsSavingRevenue(false);
                            // Update the selectedBooking in state with the new revenue to reflect change immediately
                            // and prevent modal from closing if we want to make further edits.
                            // However, for simplicity and to ensure data consistency, we'll refetch.
                            setSelectedBooking(null); // This will close the modal
                            setEditRevenue(null); // Reset edit revenue state
                            // Refresh events and revenue total
                            // Use refreshBookings directly if it's stable and available
                            if (typeof refreshBookings === 'function') {
                              await refreshBookings();
                            } else {
                              // Fallback to original fetch logic if refreshBookings isn't suitable here
                              fetchBookings(calendarViewDates.start, calendarViewDates.end).then(bookings => {
                                const selectedBeachesList = sites.filter(site => selectedBeaches[site]);
                                const filteredBookings = bookings.filter(b => {
                                  const beachName = typeof b.beach === 'object' ? b.beach?.name : b.beach;
                                  if (selectedBeachesList.length === 0) return false;
                                  return selectedBeachesList.includes(beachName);
                                });
                                const evts = filteredBookings.map(b => ({
                                  id: b._id,
                                  title: `${b.activity?.name || b.activity} - ${typeof b.beach === 'object' ? b.beach?.name : b.beach || 'No Beach'} (${b.clientName})`,
                                  start: b.date ? new Date(b.date).toISOString().split('T')[0] + 'T' + (b.startTime || '09:00') : undefined,
                                  end: b.date ? new Date(b.date).toISOString().split('T')[0] + 'T' + (b.endTime || '10:00') : undefined,
                                  extendedProps: b,
                                  color: b.status === 'Confirmed' ? '#198754' : '#ffc107',
                                }));
                                setEvents(evts);
                                const total = filteredBookings.reduce((sum, b) => sum + getActivityPrice(b), 0);
                                setRevenueTotal(total);
                              });
                            }
                          }}
                        >
                          {isSavingRevenue ? 'Saving...' : 'Save Revenue'}
                        </button>
                      </div>

                      {/* Messages Panel */}
                      <MessagesPanel selectedBooking={selectedBooking} />

                      <div className="flex justify-between mt-4">
                        <div className="space-x-2">
                          <button
                            className="px-4 py-2 bg-yellow-500 text-white rounded"
                            onClick={() => {
                              // Initialize reschedule form with current booking values
                              const currentDate = new Date(selectedBooking.date);
                              setRescheduleDate(currentDate.toISOString().split('T')[0]);
                              setRescheduleStartTime(selectedBooking.startTime);
                              setRescheduleEndTime(selectedBooking.endTime);
                              setIsRescheduling(true);
                            }}
                          >
                            Reschedule
                          </button>
                          <button
                            className="px-4 py-2 bg-red-600 text-white rounded"
                            onClick={() => setIsDeleting(true)}
                          >
                            Delete
                          </button>
                        </div>
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded"
                          onClick={() => {
                            setSelectedBooking(null);
                            setEditRevenue(null);
                            setIsRescheduling(false);
                            setIsDeleting(false);
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        
        {/* New Booking Modal */}
        {isNewBookingModalOpen && selectedDateForNewBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 overflow-y-auto">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
              <h3 className="text-2xl font-semibold mb-6 text-white">Create New Booking for {new Date(selectedDateForNewBooking + 'T00:00:00').toLocaleDateString()}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-300 mb-1">Client Name</label>
                  <input type="text" id="clientName" value={newBookingClientName} onChange={(e) => setNewBookingClientName(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-300 mb-1">Client Email</label>
                  <input type="email" id="clientEmail" value={newBookingClientEmail} onChange={(e) => setNewBookingClientEmail(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-300 mb-1">Client Phone</label>
                  <input type="tel" id="clientPhone" value={newBookingClientPhone} onChange={(e) => setNewBookingClientPhone(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="beach" className="block text-sm font-medium text-gray-300 mb-1">Beach</label>
                  <select id="beach" value={newBookingBeach} onChange={(e) => setNewBookingBeach(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500">
                    {sites.map(site => <option key={site} value={site}>{site}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="activity" className="block text-sm font-medium text-gray-300 mb-1">Activity</label>
                  <select id="activity" value={newBookingActivityId} onChange={(e) => setNewBookingActivityId(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500">
                    {activities.map(act => <option key={act.id} value={act.id}>{act.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="participants" className="block text-sm font-medium text-gray-300 mb-1">Participants</label>
                  <input type="number" id="participants" value={newBookingParticipants} onChange={(e) => setNewBookingParticipants(Math.max(1, parseInt(e.target.value,10) || 1))} min="1" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                  <input type="time" id="startTime" value={newBookingStartTime} onChange={(e) => setNewBookingStartTime(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                  <input type="time" id="endTime" value={newBookingEndTime} onChange={(e) => setNewBookingEndTime(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                 <div className="md:col-span-2">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select id="status" value={newBookingStatus} onChange={(e) => setNewBookingStatus(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500">
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Group Inquiry">Group Inquiry</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-300 mb-1">Payment Method</label>
                  <select id="paymentMethod" value={newBookingPaymentMethod} onChange={(e) => setNewBookingPaymentMethod(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500">
                    {paymentMethodOptions.map(method => <option key={method} value={method}>{method}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                  <textarea id="notes" value={newBookingNotes} onChange={(e) => setNewBookingNotes(e.target.value)} rows="3" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
                {/* Revenue Field for New Booking */}
                <div className="md:col-span-2">
                      {/* Log newBookingRevenue state for debugging */}
                      {console.log('[NewBookingModal] newBookingRevenue state:', newBookingRevenue)}
                      <label htmlFor="newBookingRevenue" className="block text-sm font-medium text-gray-700 mt-2">Revenue (USD):</label>
                      <input 
                    type="number" 
                    id="newBookingRevenue" 
                    value={newBookingRevenue} 
                    onChange={(e) => setNewBookingRevenue(e.target.value)} 
                    placeholder="e.g., 100.00" 
                    min="0" 
                    step="0.01" 
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  className="px-6 py-2.5 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors w-full sm:w-auto"
                  onClick={() => setIsNewBookingModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
                  onClick={handleSaveNewBooking}
                >
                  Save Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <MessagesInbox />
        )}
      </div>
    </div>
  );
}
