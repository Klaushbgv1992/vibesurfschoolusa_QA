"use client";
import React, { useState, useEffect, useRef } from "react";
import { activities } from '../../../data/booking-options';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const fetchBookings = async (start, end) => {
  // Fetch all bookings within the calendar range
  const response = await fetch(`/api/bookings?start=${start}&end=${end}`);
  const data = await response.json();
  if (data.success) {
    return data.bookings;
  }
  return [];
};

export default function AdminBookingsPage() {
  const [events, setEvents] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [calendarViewDates, setCalendarViewDates] = useState({ start: '', end: '' });
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [editRevenue, setEditRevenue] = useState(null);
  const [isSavingRevenue, setIsSavingRevenue] = useState(false);

  // Helper to check if a booking is a 5+ group lesson
  const isGroupLesson = (booking) => {
    const activity = booking.activity?.name || booking.activity || '';
    return activity.toLowerCase().includes('5+') || activity.toLowerCase().includes('group');
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

  // Fetch bookings when calendar view changes
  useEffect(() => {
    if (calendarViewDates.start) {
      fetchBookings(calendarViewDates.start, calendarViewDates.end).then(bookings => {
        const evts = bookings.map(b => ({
          id: b._id,
          title: `${b.activity?.name || b.activity} (${b.clientName})`,
          start: b.date ? new Date(b.date).toISOString().split('T')[0] + 'T' + (b.startTime || '09:00') : undefined,
          end: b.date ? new Date(b.date).toISOString().split('T')[0] + 'T' + (b.endTime || '10:00') : undefined,
          extendedProps: b,
          color: b.status === 'Confirmed' ? '#198754' : '#ffc107',
        }));
        setEvents(evts);
        // Calculate revenue total using latest activity prices (except for 5+ group)
        const total = bookings.reduce((sum, b) => sum + getActivityPrice(b), 0);
        setRevenueTotal(total);
      });
    }
  }, [calendarViewDates]);

  // Handle date range change in calendar
  const handleDatesSet = (arg) => {
    setCalendarViewDates({
      start: arg.startStr.split('T')[0],
      end: arg.endStr.split('T')[0],
    });
  };

  // Handle event click
  const handleEventClick = (clickInfo) => {
    setSelectedBooking(clickInfo.event.extendedProps);
  };

  // TODO: Implement block/unblock days logic
  const handleDateClick = (info) => {
    // Example: Block/unblock logic can go here
    alert(`Block/unblock logic for ${info.dateStr} (not implemented)`);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold mb-4">Admin Bookings Calendar</h1>
      <div className="mb-4 p-3 bg-gray-100 rounded shadow-md flex items-center justify-between">
        <span className="font-semibold">Total Revenue (Current View):</span>
        <span className="text-xl font-bold text-green-700">${revenueTotal.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</span>
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
      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-[350px] max-w-[90vw]">
            <h2 className="text-lg font-bold mb-2">Booking Details</h2>
            <div className="mb-2"><b>Client:</b> {selectedBooking.clientName}</div>
            <div className="mb-2"><b>Email:</b> {selectedBooking.clientEmail}</div>
            <div className="mb-2"><b>Phone:</b> {selectedBooking.clientPhone}</div>
            <div className="mb-2"><b>Activity:</b> {selectedBooking.activity?.name || selectedBooking.activity}</div>
            <div className="mb-2"><b>Date:</b> {selectedBooking.date?.toString().split('T')[0]}</div>
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
            const evts = bookings.map(b => ({
              id: b._id,
              title: `${b.activity?.name || b.activity} (${b.clientName})`,
              start: b.date ? new Date(b.date).toISOString().split('T')[0] + 'T' + (b.startTime || '09:00') : undefined,
              end: b.date ? new Date(b.date).toISOString().split('T')[0] + 'T' + (b.endTime || '10:00') : undefined,
              extendedProps: b,
              color: b.status === 'Confirmed' ? '#198754' : '#ffc107',
            }));
            setEvents(evts);
            // Calculate revenue total using latest activity prices (except for 5+ group)
            const total = bookings.reduce((sum, b) => sum + getActivityPrice(b), 0);
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

            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => { setSelectedBooking(null); setEditRevenue(null); }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
