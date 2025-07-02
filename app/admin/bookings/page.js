"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
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

// Define sites outside the component for a stable reference
const sites = [
  'Pompano Beach',
  'Sunny Isles Beach',
  'Dania Beach',
];

export default function AdminBookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('calendar');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Check authentication on client side
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('vibeAdminAuth') === 'true';
    if (!isAuthenticated) {
      router.push('/admin/login');
    } else {
      setAuthChecked(true);
    }
  }, [router]);

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

  // State for editing an existing booking in the modal
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBookingData, setEditingBookingData] = useState(null);

  // State for the "Create New Booking" modal
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [newBookingData, setNewBookingData] = useState({
    date: '',
    activityId: '', // Will be selected in the modal
    participants: 1,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    paymentMethod: 'Pending', // Default payment method
    paymentStatus: 'Pending', // Default payment status
    totalPrice: 0, // Will be calculated or entered
    notes: '',
    beachId: sites[0], // Default to the first beach in the sites array
    startTime: '09:00', // Default start time
    endTime: '10:00',   // Default end time
    revenue: 0, // For admin manual entry, if applicable
  });

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
    console.log('[Effect Triggered] selectedBeaches changed to:', JSON.parse(JSON.stringify(selectedBeaches)));
    console.log('[Effect Triggered] calendarViewDates:', calendarViewDates.start, calendarViewDates.end);

    if (calendarViewDates.start && calendarViewDates.end) {
      setIsProcessing(true); // Show loading state
      console.log('[Effect Run] Deps valid. Fetching bookings. Dates:', calendarViewDates, 'Selected Beaches:', JSON.parse(JSON.stringify(selectedBeaches)));
      fetchBookings(calendarViewDates.start, calendarViewDates.end)
        .then(allBookingsData => {
          console.log('[Effect - Fetch Success] Raw bookings data received (length):', allBookingsData?.length, allBookingsData);
          
          const currentSelectedBeaches = selectedBeaches; // Capture current state for this run
          const selectedBeachesList = Object.keys(currentSelectedBeaches).filter(
            (beach) => currentSelectedBeaches[beach]
          );
          console.log('[Effect - Filtering] selectedBeachesList (from currentSelectedBeaches):', selectedBeachesList);

          const filteredBookings = allBookingsData.filter(b => {
            const beachName = typeof b.beach === 'object' ? b.beach?.name : b.beach;
            if (!beachName) return false; 
            
            // If no beaches are selected in the filter, show no bookings.
            if (selectedBeachesList.length === 0) return false;
            // Otherwise, only include bookings for the selected beaches.
            return selectedBeachesList.includes(beachName);
          });
          console.log('[Effect - Filtering] filteredBookings (length):', filteredBookings?.length, filteredBookings);

          const evts = filteredBookings.map(b => ({
            id: b._id,
            title: `${b.activity?.name || b.activity} - ${typeof b.beach === 'object' ? b.beach?.name : b.beach || 'No Beach'} (${b.clientName})`,
            start: b.date ? new Date(b.date).toISOString().split('T')[0] + 'T' + (b.startTime || '09:00') : undefined,
            end: b.date ? new Date(b.date).toISOString().split('T')[0] + 'T' + (b.endTime || '10:00') : undefined,
            extendedProps: b,
            color: b.status === 'Confirmed' ? '#198754' : (b.status === 'Group Inquiry' ? '#0dcaf0' : '#ffc107'),
            borderColor: b.status === 'Confirmed' ? '#198754' : (b.status === 'Group Inquiry' ? '#0dcaf0' : '#ffc107'),
          }));
          console.log('[Effect - Setting Events] evts to be set (length):', evts?.length, evts);
          setEvents(evts);
          
          const total = filteredBookings.reduce((acc, booking) => {
            // Use the revenue field if it exists and is a number, otherwise calculate it
            const revenue = typeof booking.revenue === 'number' ? booking.revenue : getActivityPrice(booking);
            return acc + revenue;
          }, 0);
          setRevenueTotal(total);
          console.log('[Effect - Revenue] Calculated revenue:', total);
        })
        .catch(error => {
          console.error("[Effect - Fetch Error] Error processing bookings:", error);
          setEvents([]); 
          setRevenueTotal(0);
        })
        .finally(() => {
          setIsProcessing(false); 
          console.log('[Effect - Finally] Processing finished.');
        });
  } else {
    console.log('[Effect Run] Skipped: calendarViewDates not fully set yet or invalid.', calendarViewDates);
    // Optionally, clear events if dates are invalid to prevent showing stale data
    // setEvents([]);
    // setRevenueTotal(0);
  }
}, [calendarViewDates.start, calendarViewDates.end, selectedBeaches, sites]);

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

  const handleDateClick = (info) => {
    // Pre-fill the clicked date for the new booking
    setNewBookingData(prev => ({ 
      ...prev, 
      date: info.dateStr,
      // Optionally reset other fields to defaults if needed, or carry them over
      // For example, to reset activityId and participants:
      // activityId: '', 
      // participants: 1,
    }));
    // Open the new booking modal
    setIsNewBookingModalOpen(true);
  };

  const handleNewBookingInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // For activityId and participants, parse to number if applicable
    let processedValue = value;
    if (name === 'activityId') { // Assuming activityId is just the ID string, price is looked up elsewhere
      // If activityId implies a price change, you might want to update revenue/totalPrice here or in an effect
    } else if (name === 'participants' || name === 'revenue') {
      processedValue = value === '' ? '' : parseFloat(value);
    }

    setNewBookingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue,
    }));
  };

  const handleSaveNewBooking = async () => {
    setIsProcessing(true);
    try {
      const selectedActivityObject = activities.find(act => act.id === newBookingData.activityId);

      if (!selectedActivityObject) {
        console.error('Selected activity not found for ID:', newBookingData.activityId);
        alert('Error: Selected activity is invalid. Please re-select the activity.');
        setIsProcessing(false);
        return;
      }

      const bookingPayload = {
        clientName: newBookingData.clientName,
        clientEmail: newBookingData.clientEmail,
        clientPhone: newBookingData.clientPhone,
        beach: newBookingData.beachId, // The backend expects 'beach' with the location name
        activity: selectedActivityObject, // Send the full activity object
        activityId: newBookingData.activityId, // Also send activityId as backend uses it
        date: newBookingData.date,
        startTime: newBookingData.startTime,
        endTime: newBookingData.endTime,
        participants: newBookingData.participants,
        notes: newBookingData.notes,
        paymentMethod: newBookingData.paymentMethod,
        revenue: newBookingData.revenue,
        status: newBookingData.paymentStatus || (newBookingData.paymentMethod === 'Pending' ? 'Pending' : 'Confirmed'), // Backend expects 'status'
        paymentDetails: {
          source: 'AdminManualEntry',
          method: newBookingData.paymentMethod, // This might be redundant if backend uses top-level paymentMethod
        },
        // isGroupInquiry and groupAges are not part of this admin form, so they won't be sent unless added to newBookingData
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      if (response.ok) {
        setIsNewBookingModalOpen(false);
        // Reset newBookingData to defaults after successful save
        setNewBookingData({
          date: '',
          activityId: '',
          participants: 1,
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          paymentMethod: 'Pending',
          paymentStatus: 'Pending',
          totalPrice: 0,
          notes: '',
          beachId: sites[0],
          startTime: '09:00',
          endTime: '10:00',
          revenue: 0,
        });
        // Refresh calendar events
        if (calendarViewDates.start && calendarViewDates.end) {
          fetchBookings(calendarViewDates.start, calendarViewDates.end).then(fetchedEvents => {
            // Assuming fetchBookings returns the raw booking data and needs mapping
            const evts = fetchedEvents.map(b => ({
              id: b._id,
              title: `${b.activity?.name || b.activity} - ${typeof b.beach === 'object' ? b.beach?.name : b.beach || 'No Beach'} (${b.clientName})`,
              start: b.date ? new Date(b.date).toISOString().split('T')[0] + 'T' + (b.startTime || '09:00') : undefined,
              end: b.date ? new Date(b.date).toISOString().split('T')[0] + 'T' + (b.endTime || '10:00') : undefined,
              extendedProps: b,
              color: b.status === 'Confirmed' ? '#198754' : (b.status === 'Cancelled' ? '#dc3545' : '#ffc107'), // Added cancelled color
            }));
            console.log('Calendar Events (refreshBookings):', evts.map(e => ({ id: e.id, title: e.title }))); // DEBUG: Log event IDs and titles
            setEvents(evts);
            // Recalculate revenue total
            const total = fetchedEvents.reduce((sum, b) => sum + getActivityPrice(b), 0);
            setRevenueTotal(total);
          });
        }
        alert('Booking created successfully!');
      } else {
        const errorData = await response.json();
        console.error('Failed to save booking:', errorData);
        alert(`Failed to save booking: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      alert(`Error saving booking: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler for input changes in the edit booking form
  const handleEditBookingInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // For numeric fields that can be empty, handle parsing carefully
    let processedValue = value;
    if (['participants', 'revenue'].includes(name)) {
      processedValue = value === '' ? '' : parseFloat(value);
      if (isNaN(processedValue)) processedValue = ''; // Keep as empty string if not a valid number
    } else if (type === 'checkbox') {
      processedValue = checked;
    }

    setEditingBookingData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  // Handler for saving updated booking details
  const handleUpdateBooking = async () => {
    if (!editingBookingData || !editingBookingData._id) {
      alert('No booking selected or booking ID is missing.');
      return;
    }
    setIsProcessing(true);
    try {
      const payload = { ...editingBookingData };

      // Ensure activity is the full object if activityId was changed
      if (payload.activityId && typeof payload.activityId === 'string' && (!payload.activity || payload.activity.id !== payload.activityId)) {
        const selectedActivityObject = activities.find(act => act.id === payload.activityId);
        if (selectedActivityObject) {
          payload.activity = selectedActivityObject;
        } else {
          console.warn('Activity ID selected in edit mode does not match any known activity.');
          // Potentially alert user or handle as an error
        }
      }

      // Ensure beach is the string name if beachId was used for a dropdown and is different
      if (payload.beachId && typeof payload.beachId === 'string' && payload.beach !== payload.beachId) {
        payload.beach = payload.beachId;
      }
      
      // Clean up helper IDs if your backend doesn't expect them or expects specific structures
      // delete payload.beachId; 
      // delete payload.activityId; // Only if backend solely relies on the 'activity' object and not 'activityId' for updates

      const response = await fetch(`/api/bookings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingBookingData._id, ...payload }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert('Booking updated successfully!');
        setIsEditMode(false);
        setSelectedBooking(null); 
        setEditingBookingData(null); 
        if (calendarViewDates.start && calendarViewDates.end) {
          fetchBookings(calendarViewDates.start, calendarViewDates.end).then(fetchedEvents => {
            const selectedBeachesList = sites.filter(site => selectedBeaches[site]);
            const filteredBookingsResult = fetchedEvents.filter(b => {
              const beachName = typeof b.beach === 'object' ? b.beach?.name : b.beach;
              if (selectedBeachesList.length === 0) return false;
              return selectedBeachesList.includes(beachName);
            });
            const evts = filteredBookingsResult.map(b => ({
              id: b._id,
              title: `${b.activity?.name || b.activity} - ${typeof b.beach === 'object' ? b.beach?.name : b.beach || 'No Beach'} (${b.clientName})`,
              start: b.date ? new Date(b.date).toISOString().split('T')[0] + 'T' + (b.startTime || '09:00') : undefined,
              end: b.date ? new Date(b.date).toISOString().split('T')[0] + 'T' + (b.endTime || '10:00') : undefined,
              extendedProps: b,
              color: b.status === 'Confirmed' ? '#198754' : (b.status === 'Cancelled' ? '#dc3545' : '#ffc107'),
            }));
            setEvents(evts);
            const total = filteredBookingsResult.reduce((sum, b) => sum + getActivityPrice(b), 0);
            setRevenueTotal(total);
          });
        }
      } else {
        alert(`Failed to update booking: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert(`Error updating booking: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!authChecked) {
    return null; // Or a loading spinner
  }

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
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                height="auto"
                events={events}
                datesSet={handleDatesSet}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                dayMaxEvents={3}
                showNonCurrentDates={false}
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
            <BookingSettingsPanel sites={sites.filter(site => selectedBeaches[site])} selectedBeaches={selectedBeaches} />

            {/* Booking Details Modal */}
            {selectedBooking && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg min-w-[450px] max-w-[90vw] max-h-[90vh] flex flex-col">
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
                  ) : isEditMode && editingBookingData ? (
                    /* Edit Mode */
                    <div className="flex flex-col overflow-hidden flex-grow">
                      <h2 className="text-lg font-bold mb-4 flex-shrink-0">Edit Booking</h2>
                      <div className="flex-grow overflow-y-auto pr-2">
                        {/* Client Name */}
                        <div className="mb-3">
                          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Name</label>
                          <input type="text" name="clientName" id="clientName" value={editingBookingData.clientName || ''} onChange={handleEditBookingInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        {/* Client Email */}
                        <div className="mb-3">
                          <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Client Email</label>
                          <input type="email" name="clientEmail" id="clientEmail" value={editingBookingData.clientEmail || ''} onChange={handleEditBookingInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        {/* Client Phone */}
                        <div className="mb-3">
                          <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">Client Phone</label>
                          <input type="tel" name="clientPhone" id="clientPhone" value={editingBookingData.clientPhone || ''} onChange={handleEditBookingInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        {/* Date */}
                        <div className="mb-3">
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                          <input type="date" name="date" id="date" value={editingBookingData.date || ''} onChange={handleEditBookingInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        {/* Start Time */}
                        <div className="mb-3">
                          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                          <input type="time" name="startTime" id="startTime" value={editingBookingData.startTime || ''} onChange={handleEditBookingInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        {/* End Time */}
                        <div className="mb-3">
                          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                          <input type="time" name="endTime" id="endTime" value={editingBookingData.endTime || ''} onChange={handleEditBookingInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        {/* Activity */}
                        <div className="mb-3">
                          <label htmlFor="activityId" className="block text-sm font-medium text-gray-700">Activity</label>
                          <select name="activityId" id="activityId" value={editingBookingData.activityId || ''} onChange={handleEditBookingInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="">Select Activity</option>
                            {activities.map(act => <option key={act.id} value={act.id}>{act.name}</option>)}
                          </select>
                        </div>
                        {/* Beach */}
                        <div className="mb-3">
                          <label htmlFor="beachId" className="block text-sm font-medium text-gray-700">Beach</label>
                          <select name="beachId" id="beachId" value={editingBookingData.beachId || ''} onChange={handleEditBookingInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                             {sites.map(site => <option key={site} value={site}>{site}</option>)}
                          </select>
                        </div>
                        {/* Participants */}
                        <div className="mb-3">
                          <label htmlFor="participants" className="block text-sm font-medium text-gray-700">Participants</label>
                          <input type="number" name="participants" id="participants" value={editingBookingData.participants || 1} onChange={handleEditBookingInputChange} min="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        {/* Status */}
                        <div className="mb-3">
                          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                          <select name="status" id="status" value={editingBookingData.status || 'Pending'} onChange={handleEditBookingInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                            {/* Add other statuses if applicable */}
                          </select>
                        </div>
                        {/* Revenue */}
                        <div className="mb-3">
                          <label htmlFor="revenue" className="block text-sm font-medium text-gray-700">Revenue ($)</label>
                          <input type="number" name="revenue" id="revenue" value={editingBookingData.revenue === null || editingBookingData.revenue === undefined ? '' : editingBookingData.revenue} onChange={handleEditBookingInputChange} min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        {/* Notes */}
                        <div className="mb-3">
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                          <textarea name="notes" id="notes" value={editingBookingData.notes || ''} onChange={handleEditBookingInputChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                        </div>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3 mt-6 flex-shrink-0">
                        <button type="button" onClick={() => setIsEditMode(false)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={isProcessing}>
                          Cancel Edit
                        </button>
                        <button onClick={handleUpdateBooking} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" disabled={isProcessing}>
                          {isProcessing ? 'Saving...' : 'Save Changes'}
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
                      <div className="mb-2"><b>Date:</b> {selectedBooking.date ? (() => { const d = new Date(selectedBooking.date); return `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`; })() : 'N/A'}</div>
                      <div className="mb-2"><b>Time:</b> {selectedBooking.startTime} - {selectedBooking.endTime}</div>
                      <div className="mb-2"><b>Status:</b> {selectedBooking.status}</div>
                      <div className="mb-2"><b>Participants:</b> {selectedBooking.participants}</div>
                      {selectedBooking.groupAges && <div className="mb-2"><b>Group Ages:</b> {selectedBooking.groupAges}</div>}
                      {selectedBooking.notes && <div className="mb-2"><b>Notes:</b> {selectedBooking.notes}</div>}
                      <div className="mb-2"><b>Revenue:</b> {(selectedBooking.revenue || 0).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</div>
                      
                      {/* Messages Panel */}
                      <MessagesPanel selectedBooking={selectedBooking} />

                      <div className="flex justify-between mt-4">
                        <div className="space-x-2">
                          <button
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            onClick={() => {

                              // Prepare data for edit mode
                              const bookingToEdit = {
                                ...selectedBooking,
                                date: selectedBooking.date ? new Date(selectedBooking.date).toISOString().split('T')[0] : '',
                                activityId: selectedBooking.activity?.id || selectedBooking.activityId || '',
                                beachId: typeof selectedBooking.beach === 'object' ? selectedBooking.beach?.name : selectedBooking.beach || sites[0],
                                // Ensure revenue is a number, default to 0 if not set
                                revenue: typeof selectedBooking.revenue === 'number' ? selectedBooking.revenue : 0,
                              };
                              setEditingBookingData(bookingToEdit);
                              setIsEditMode(true);
                              setIsRescheduling(false); // Ensure other modes are off
                              setIsDeleting(false);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            onClick={() => {
                              const currentDate = new Date(selectedBooking.date);
                              setRescheduleDate(currentDate.toISOString().split('T')[0]);
                              setRescheduleStartTime(selectedBooking.startTime);
                              setRescheduleEndTime(selectedBooking.endTime);
                              setIsRescheduling(true);
                              setIsEditMode(false); // Ensure other modes are off
                              setIsDeleting(false);
                            }}
                          >
                            Reschedule
                          </button>
                          <button
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={() => {
                              setIsDeleting(true);
                              setIsEditMode(false); // Ensure other modes are off
                              setIsRescheduling(false);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={() => {
                            setSelectedBooking(null);
                            setEditingBookingData(null);
                            setIsEditMode(false);
                            setIsRescheduling(false);
                            setIsDeleting(false);
                            // setEditRevenue(null); // If you were using a separate editRevenue state
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

        {/* Create New Booking Modal */}
        {isNewBookingModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create New Booking</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleSaveNewBooking(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      value={newBookingData.date}
                      onChange={handleNewBookingInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="activityId" className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                    <select
                      name="activityId"
                      id="activityId"
                      value={newBookingData.activityId}
                      onChange={handleNewBookingInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="">Select Activity</option>
                      {activities.map(activity => (
                        <option key={activity.id} value={activity.id}>
                          {activity.name} - ${activity.price}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      id="startTime"
                      value={newBookingData.startTime}
                      onChange={handleNewBookingInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      id="endTime"
                      value={newBookingData.endTime}
                      onChange={handleNewBookingInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
                  <input
                    type="number"
                    name="participants"
                    id="participants"
                    value={newBookingData.participants}
                    onChange={handleNewBookingInputChange}
                    min="1"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                    <input
                      type="text"
                      name="clientName"
                      id="clientName"
                      value={newBookingData.clientName}
                      onChange={handleNewBookingInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                    <input
                      type="email"
                      name="clientEmail"
                      id="clientEmail"
                      value={newBookingData.clientEmail}
                      onChange={handleNewBookingInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-1">Client Phone</label>
                    <input
                      type="tel"
                      name="clientPhone"
                      id="clientPhone"
                      value={newBookingData.clientPhone}
                      onChange={handleNewBookingInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="beachId" className="block text-sm font-medium text-gray-700 mb-1">Beach</label>
                    <select
                      name="beachId"
                      id="beachId"
                      value={newBookingData.beachId}
                      onChange={handleNewBookingInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    >
                      {sites.map(site => (
                        <option key={site} value={site}>{site}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                      name="paymentMethod"
                      id="paymentMethod"
                      value={newBookingData.paymentMethod}
                      onChange={handleNewBookingInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      {['Cash', 'Zelle', 'Venmo', 'PayPal (Manual)', 'Card (Manual)', 'Pending'].map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="revenue" className="block text-sm font-medium text-gray-700 mb-1">Revenue ($)</label>
                    <input
                      type="number"
                      name="revenue"
                      id="revenue"
                      value={newBookingData.revenue}
                      onChange={handleNewBookingInputChange}
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    id="notes"
                    value={newBookingData.notes}
                    onChange={handleNewBookingInputChange}
                    rows="3"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsNewBookingModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    disabled={isProcessing} // Assuming isProcessing state is used for save operations
                  >
                    {isProcessing ? 'Saving...' : 'Save Booking'}
                  </button>
                </div>
              </form>
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
