"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { activities } from '../../../data/booking-options';
import BookingSettingsPanel from './BookingSettingsPanel';
import AdminNavbar from '../components/AdminNavbar';
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
  
  // Check authentication on client side
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('vibeAdminAuth') === 'true';
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [router]);
  // For demonstration, use static list of sites. You can fetch dynamically if you wish.
  const sites = [
    'Pompano Beach',
    'Sunny Isles Beach',
    'Dania Beach',
  ];
  // Replace single selection with multi-select object where each beach is a key with boolean value
  const [selectedBeaches, setSelectedBeaches] = useState({
    'Pompano Beach': true,
    'Sunny Isles Beach': false,
    'Dania Beach': false,
  });
  const [events, setEvents] = useState([]);
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

  // Function to refresh bookings data
  // Create a stable refreshBookings function with proper dependencies
  const refreshBookings = useCallback(async () => {
    if (!calendarViewDates.start || !calendarViewDates.end) return;
    
    // Prevent excessive API calls by using a flag
    setIsProcessing(true);
    
    try {
      const bookings = await fetchBookings(calendarViewDates.start, calendarViewDates.end);
      
      // Filter bookings by selected beaches
      const selectedBeachesList = sites.filter(site => selectedBeaches[site]);
      const filteredBookings = bookings.filter(b => {
        const beachName = typeof b.beach === 'object' ? b.beach?.name : b.beach;
        // If no beaches are selected, show no bookings
        if (selectedBeachesList.length === 0) return false;
        // Otherwise only show bookings for selected beaches
        return selectedBeachesList.includes(beachName);
      });
      
      const evts = filteredBookings.map(b => {
        // Ensure we have a valid id (convert to string if needed)
        const id = b._id ? (typeof b._id === 'object' && b._id.toString ? b._id.toString() : b._id) : '';
        
        return {
          id: id,
          title: `${b.activity?.name || b.activity} - ${typeof b.beach === 'object' ? b.beach?.name : b.beach || 'No Beach'} (${b.clientName})`,
          start: b.date ? new Date(b.date).toISOString().split('T')[0] + 'T' + (b.startTime || '09:00') : undefined,
          end: b.date ? new Date(b.date).toISOString().split('T')[0] + 'T' + (b.endTime || '10:00') : undefined,
          extendedProps: {...b, _id: id}, // Ensure extendedProps has the string ID
          color: b.status === 'Confirmed' ? '#198754' : '#ffc107',
        };
      });
      
      setEvents(evts);
      
      // Calculate revenue total using latest activity prices (except for 5+ group)
      const total = filteredBookings.reduce((sum, b) => sum + getActivityPrice(b), 0);
      setRevenueTotal(total);
      // Reset processing flag
      setIsProcessing(false);
    } catch (error) {
      console.error('Error refreshing bookings:', error);
    }
  }, [calendarViewDates, selectedBeaches, sites]);
  
  // Fetch bookings when calendar view changes or beach selection changes
  // Use a ref to track if we've already fetched data for these dates
  const fetchedDatesRef = useRef({});
  
  // Only refresh when dates or beach filters change, with protection against infinite loops
  useEffect(() => {
    // Skip initial render with empty dates
    if (!calendarViewDates.start || !calendarViewDates.end) return;
    
    // Create a cache key from the current state
    const cacheKey = `${calendarViewDates.start}-${calendarViewDates.end}-${Object.entries(selectedBeaches).filter(([_, v]) => v).map(([k]) => k).join('+')}`;
    
    // Only fetch if we haven't fetched this exact combination before or if we're forcing a refresh
    if (!isProcessing && !fetchedDatesRef.current[cacheKey]) {
      // Mark this combination as fetched
      fetchedDatesRef.current[cacheKey] = true;
      
      // Use setTimeout to debounce and prevent potential race conditions
      const timeoutId = setTimeout(() => {
        refreshBookings();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [calendarViewDates, selectedBeaches, isProcessing]);

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
        await refreshBookings();
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
      } else {
        // Fallback to the data we have in the event props
        setSelectedBooking(clickInfo.event.extendedProps);
        console.warn('Using cached booking data, could not fetch latest');
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      // Fallback to the data we have in the event props
      setSelectedBooking(clickInfo.event.extendedProps);
    }
  };

  // TODO: Implement block/unblock days logic
  const handleDateClick = (info) => {
    // Example: Block/unblock logic can go here
    alert(`Block/unblock logic for ${info.dateStr} (not implemented)`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-4">Admin Bookings Calendar</h1>

      <div className="mb-4 p-3 bg-gray-100 rounded shadow-md flex items-center justify-between">
        <span className="font-semibold">Total Revenue (Current View):</span>
        <span className="text-xl font-bold text-green-700">{revenueTotal.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</span>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        height="auto"
        events={events}
        datesSet={handleDatesSet}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
      />
      {/* Beach selection checkboxes */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by location:</label>
        <div className="flex flex-wrap gap-3 mt-2">
          {sites.map(site => (
            <label key={site} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="mr-1 h-4 w-4"
                checked={selectedBeaches[site]}
                onChange={() => {
                  setSelectedBeaches(prev => ({
                    ...prev,
                    [site]: !prev[site]
                  }));
                }}
              />
              <span>{site}</span>
            </label>
          ))}
          <button 
            className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-md text-gray-800 font-medium hover:bg-gray-200 ml-3 transition-colors"
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
            {Object.values(selectedBeaches).every(Boolean) ? 'Unselect All' : 'Select All'}
          </button>
        </div>
      </div>
      {/* Booking Settings Panel at bottom */}
      <BookingSettingsPanel sites={sites.filter(site => selectedBeaches[site])} selectedBeaches={selectedBeaches} />
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
                <p className="mb-6">Are you sure you want to delete this booking for <b>{selectedBooking.clientName}</b> on <b>{new Date(selectedBooking.date).toLocaleDateString()}</b>?</p>
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
                <div className="mb-2"><b>Client:</b> {selectedBooking.clientName}</div>
                <div className="mb-2"><b>Email:</b> {selectedBooking.clientEmail}</div>
                <div className="mb-2"><b>Phone:</b> {selectedBooking.clientPhone}</div>
                <div className="mb-2"><b>Activity:</b> {selectedBooking.activity?.name || selectedBooking.activity}</div>
                <div className="mb-2"><b>Beach:</b> {typeof selectedBooking.beach === 'object' ? selectedBooking.beach?.name : selectedBooking.beach || 'Not specified'}</div>
                <div className="mb-2"><b>Date:</b> {new Date(selectedBooking.date).toLocaleDateString()}</div>
                <div className="mb-2"><b>Time:</b> {selectedBooking.startTime} - {selectedBooking.endTime}</div>
                <div className="mb-2"><b>Status:</b> {selectedBooking.status}</div>
                <div className="mb-2"><b>Participants:</b> {selectedBooking.participants}</div>
                {selectedBooking.groupAges && <div className="mb-2"><b>Group Ages:</b> {selectedBooking.groupAges}</div>}
                {selectedBooking.notes && <div className="mb-2"><b>Notes:</b> {selectedBooking.notes}</div>}
                {/* Revenue Field: Editable for 5+ group lessons */}
                <div className="mb-2">
                  <b>Revenue:</b>{" "}
                  {isGroupLesson(selectedBooking) ? (
                    <>
                      <input
                        type="number"
                        className="border px-2 py-1 rounded w-24 mr-2"
                        value={editRevenue !== null ? editRevenue : (selectedBooking.revenue || 0)}
                        min={0}
                        onChange={e => setEditRevenue(Number(e.target.value))}
                      />
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
                        disabled={isSavingRevenue || (editRevenue === (selectedBooking.revenue || 0))}
                        onClick={async () => {
                          setIsSavingRevenue(true);
                          await fetch('/api/bookings', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: selectedBooking._id, revenue: editRevenue })
                          });
                          setIsSavingRevenue(false);
                          setSelectedBooking(null);
                          setEditRevenue(null);
                          // Refresh events and revenue total
                          fetchBookings(calendarViewDates.start, calendarViewDates.end).then(bookings => {
                            // Filter bookings by selected beaches
                            const selectedBeachesList = sites.filter(site => selectedBeaches[site]);
                            const filteredBookings = bookings.filter(b => {
                              const beachName = typeof b.beach === 'object' ? b.beach?.name : b.beach;
                              // If no beaches are selected, show no bookings
                              if (selectedBeachesList.length === 0) return false;
                              // Otherwise only show bookings for selected beaches
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
                            // Calculate revenue total using latest activity prices (except for 5+ group)
                            const total = filteredBookings.reduce((sum, b) => sum + getActivityPrice(b), 0);
                            setRevenueTotal(total);
                          });
                        }}
                      >
                        {isSavingRevenue ? 'Saving...' : 'Save'}
                      </button>
                    </>
                  ) : (
                    <span className="ml-2">{getActivityPrice(selectedBooking).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</span>
                  )}
                </div>

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
      </div>
    </div>
  );
}
