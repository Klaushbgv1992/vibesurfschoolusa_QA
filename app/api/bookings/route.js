import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '../../../lib/mongodb';
import { checkAvailability, createBooking } from '../../../models/booking';
import { sendAdminNotificationEmail } from '../../../lib/sendAdminNotificationEmail';

// Simple in-memory rate limiter (for production, use Redis or similar)
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  cache: new Map(),
};

async function verifyPayPalOrder(orderId) {
  const isLive = process.env.PAYPAL_ENV === 'live';
  const base = isLive
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  // Get access token
  const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) throw new Error(tokenData.error_description || 'Failed to get PayPal access token');
  const accessToken = tokenData.access_token;
  // Fetch order
  const orderRes = await fetch(`${base}/v2/checkout/orders/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  const orderData = await orderRes.json();
  if (!orderRes.ok) throw new Error(orderData.message || 'Failed to fetch PayPal order');
  return orderData;
}

export async function POST(request) {
  // Enhanced logging for debugging
  console.log('POST /api/bookings called');
  try {
    const data = await request.json();
    console.log('POST /api/bookings payload:', data);
    const { clientName, clientEmail, clientPhone, beach, activity, date, startTime, endTime, participants, notes, paymentDetails, isGroupInquiry, groupAges } = data;

    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const windowStart = now - rateLimit.windowMs;
    // Clean up expired entries
    for (const [key, timestamps] of rateLimit.cache.entries()) {
      const filtered = timestamps.filter(ts => ts > windowStart);
      if (filtered.length === 0) {
        rateLimit.cache.delete(key);
      } else {
        rateLimit.cache.set(key, filtered);
      }
    }
    // Get existing timestamps for this IP
    const timestamps = rateLimit.cache.get(ip) || [];
    if (timestamps.length >= rateLimit.maxRequests) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json({ success: false, message: 'Too many booking attempts. Please try again later.' }, { status: 429 });
    }
    // Add current timestamp
    rateLimit.cache.set(ip, [...timestamps, now]);

    // Validate required fields
    if (!clientName || !clientEmail || !clientPhone || !beach || !activity || !date || !startTime || !endTime) {
      console.warn('Booking failed: Missing required fields', { ip, data });
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // If this is a group inquiry, skip payment validation and set revenue to 0
    if (isGroupInquiry) {
      // Connect to MongoDB (ensure bookingsCollection is defined)
      const client = await clientPromise;
      const db = client.db('vibesurfschool');
      const bookingsCollection = db.collection('bookings');
      // Store group inquiry with status 'Group Inquiry'
      console.log('[DEBUG] Saving group inquiry with status:', 'Group Inquiry', {
        clientName, clientEmail, clientPhone, beach, activity, date, startTime, endTime, participants, groupAges, notes
      });
      const result = await createBooking(bookingsCollection, {
        clientName,
        clientEmail,
        clientPhone,
        beach: typeof beach === 'string' ? beach : beach.name,
        activity: typeof activity === 'string' ? activity : activity.name,
        date,
        startTime,
        endTime,
        participants: participants || 5,
        groupAges,
        notes: notes || '',
        status: 'Group Inquiry'
      });
      // Send confirmation email to client
      try {
        const { sendConfirmationEmail } = await import('../../../lib/sendConfirmationEmail.js');
        await sendConfirmationEmail({
          to: clientEmail,
          clientName,
          beach,
          activity,
          date,
          startTime,
          endTime,
          isGroupInquiry: true,
          participants: participants || 5 // Ensure participants is passed
        });
        console.log('Group booking confirmation email sent to', clientEmail);
      } catch (emailErr) {
        console.error('Failed to send group booking confirmation email:', emailErr);
        // Do not fail the booking if email fails
      }

      // Send admin notification email for group inquiry
      try {
        const bookingDetailsForAdmin = {
          _id: result.insertedId,
          clientName,
          clientEmail,
          clientPhone,
          beach, // Pass the original beach object/string
          activity, // Pass the original activity object/string
          date,
          startTime,
          endTime,
          participants: participants || 5,
          groupAges,
          notes: notes || '',
          status: 'Group Inquiry'
        };
        await sendAdminNotificationEmail({
          action: 'New Group Inquiry',
          bookingDetails: bookingDetailsForAdmin,
          adminEmail: process.env.ADMIN_EMAIL
        });
        console.log('Admin notification email sent for group inquiry ID:', result.insertedId);
      } catch (adminEmailErr) {
        console.error('Failed to send admin notification email for group inquiry:', adminEmailErr);
        // Do not fail the booking if admin email fails
      }
      return NextResponse.json({ 
        success: true, 
        message: 'Group booking inquiry submitted! We will contact you soon.',
        bookingId: result.insertedId
      });
    }

    // Require verified PayPal payment
    if (!paymentDetails || !paymentDetails.id || paymentDetails.status !== 'COMPLETED') {
      console.warn('Booking failed: Payment not verified or not completed', { ip, paymentDetails });
      return NextResponse.json({ success: false, message: 'Payment not verified or not completed.' }, { status: 400 });
    }

    // Double-check PayPal order status server-side
    try {
      const paypalOrder = await verifyPayPalOrder(paymentDetails.id);
      if (paypalOrder.status !== 'COMPLETED') {
        console.warn('Booking failed: PayPal order not completed on backend', { ip, paypalOrder });
        return NextResponse.json({ success: false, message: 'Payment not completed on PayPal.' }, { status: 400 });
      }
    } catch (err) {
      console.error('Booking failed: PayPal verification error', { ip, error: err.message });
      return NextResponse.json({ success: false, message: 'Could not verify PayPal payment', error: err.message }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('vibesurfschool');
    const bookingsCollection = db.collection('bookings');

    // Normalize beach and activity to strings for consistency
    const normalizedBeach = typeof beach === 'object' && beach !== null ? beach.name : beach;
    const normalizedActivity = typeof activity === 'object' && activity !== null ? activity.name : activity;

    // Check if the selected time slot is available
    const isAvailable = await checkAvailability(
      bookingsCollection,
      normalizedBeach,
      normalizedActivity,
      date,
      startTime,
      endTime
    );

    if (!isAvailable) {
      return NextResponse.json({ 
        success: false, 
        message: 'This time slot is already booked. Please select another time.' 
      }, { status: 409 });
    }

    // Calculate revenue for non-group bookings
    let calculatedRevenue = 0;
    let price = 0;
    if (typeof activity === 'object' && typeof activity.price === 'number') {
      price = activity.price;
    } else if (!isNaN(Number(activity?.price))) {
      price = Number(activity.price);
    }
    const numParticipants = parseInt(participants) || 1;
    calculatedRevenue = price * numParticipants;

    // Save the booking (confirmed or group inquiry)
    const bookingData = {
      clientName,
      clientEmail,
      clientPhone,
      beach: normalizedBeach,
      activity: normalizedActivity,
      date: new Date(date),
      startTime,
      endTime,
      participants: numParticipants,
      notes: notes || '',
      status: 'Confirmed',
      created: new Date(),
      revenue: calculatedRevenue
    };

    // Create the booking
    const result = await createBooking(bookingsCollection, bookingData);

    // Send confirmation email to client
    try {
      const { sendConfirmationEmail } = await import('../../../lib/sendConfirmationEmail.js');
      await sendConfirmationEmail({
        to: clientEmail,
        clientName,
        beach,
        activity,
        date,
        startTime,
        endTime,
        isGroupInquiry: false,
        participants: numParticipants // Pass numParticipants for regular bookings
      });
      console.log('Booking confirmation email sent to', clientEmail);
    } catch (emailErr) {
      console.error('Failed to send booking confirmation email:', emailErr);
      // Do not fail the booking if email fails
    }

    // Send admin notification email for confirmed booking
    try {
      const bookingDetailsForAdmin = {
        ...bookingData,
        _id: result.insertedId
      };
      await sendAdminNotificationEmail({
        action: 'New Booking Confirmed',
        bookingDetails: bookingDetailsForAdmin,
        adminEmail: process.env.ADMIN_EMAIL
      });
      console.log('Admin notification email sent for booking ID:', result.insertedId);
    } catch (adminEmailErr) {
      console.error('Failed to send admin notification email for booking:', adminEmailErr);
      // Do not fail the booking if admin email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Booking successful!',
      bookingId: result.insertedId
    });

  } catch (error) {
    console.error('Error creating booking:', error, error.stack);
    return NextResponse.json({ 
      success: false, 
      message: 'There was an error processing your booking. Please try again.',
      error: error.message
    }, { status: 500 });
  }
}

export async function PATCH(request) {
  // Check if this is an admin request
  if (!isAdminRequest(request)) {
    return NextResponse.json({ 
      success: false, 
      message: 'Unauthorized. Admin access required.' 
    }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { id } = data;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Booking ID is required.' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db('vibesurfschool');
    const bookingsCollection = db.collection('bookings');
    const { ObjectId } = require('mongodb');
    
    const updateFields = {};
    if (typeof data.revenue === 'number') updateFields.revenue = data.revenue;
    if (data.date) updateFields.date = new Date(data.date);
    if (data.startTime) updateFields.startTime = data.startTime;
    if (data.endTime) updateFields.endTime = data.endTime;
    if (data.status) updateFields.status = data.status; // Allow status updates
    if (data.notes) updateFields.notes = data.notes; // Allow notes updates
    // Add other fields as necessary, e.g., clientName, clientEmail, etc.
    if (data.clientName) updateFields.clientName = data.clientName;
    if (data.clientEmail) updateFields.clientEmail = data.clientEmail;
    if (data.clientPhone) updateFields.clientPhone = data.clientPhone;
    if (data.participants) updateFields.participants = data.participants;
    if (data.activity) updateFields.activity = typeof data.activity === 'string' ? data.activity : data.activity.name;
    if (data.beach) updateFields.beach = typeof data.beach === 'string' ? data.beach : data.beach.name;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No valid fields to update were provided.' 
      }, { status: 400 });
    }
    
    const result = await bookingsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );
    
    const updatedBooking = result.value || result;
    
    if (!updatedBooking) {
      return NextResponse.json({ success: false, message: 'Booking not found.' }, { status: 404 });
    }

    // Send admin notification email
    if (process.env.ADMIN_EMAIL) {
      let action = 'Modified';
      if (data.date || data.startTime || data.endTime) {
        action = 'Rescheduled';
      }
      try {
        await sendAdminNotificationEmail({
          action: action,
          bookingDetails: updatedBooking,
          adminEmail: process.env.ADMIN_EMAIL
        });
      } catch (emailError) {
        console.error(`Failed to send admin notification email for ${action} booking:`, emailError);
        // Do not let email failure break the main API response
      }
    }
    
    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error('Error updating booking:', error, error.stack);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update booking.', 
      error: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  // Check if this is an admin request
  if (!isAdminRequest(request)) {
    return NextResponse.json({ 
      success: false, 
      message: 'Unauthorized. Admin access required.' 
    }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Booking ID is required.' 
      }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db('vibesurfschool');
    const bookingsCollection = db.collection('bookings');
    const { ObjectId } = require('mongodb');

    // Fetch booking details before deleting for email notification
    const bookingToDelete = await bookingsCollection.findOne({ _id: new ObjectId(id) });

    if (!bookingToDelete) {
      return NextResponse.json({ 
        success: false, 
        message: 'Booking not found.' 
      }, { status: 404 });
    }
    
    const result = await bookingsCollection.deleteOne({ _id: new ObjectId(id) });
      
    if (result.deletedCount === 0) {
      // This case should ideally be caught by the findOne above, but as a fallback:
      return NextResponse.json({ 
        success: false, 
        message: 'Booking not found or already deleted (delete operation failed).'
      }, { status: 404 });
    }

    // Send admin notification email
    if (process.env.ADMIN_EMAIL) {
      try {
        await sendAdminNotificationEmail({
          action: 'Deleted',
          bookingDetails: bookingToDelete, // Use the fetched booking details
          adminEmail: process.env.ADMIN_EMAIL
        });
      } catch (emailError) {
        console.error('Failed to send admin notification email for deleted booking:', emailError);
        // Do not let email failure break the main API response
      }
    }
        
    return NextResponse.json({ 
      success: true, 
      message: 'Booking successfully deleted.' 
    });
  } catch (error) {
    console.error('Error deleting booking:', error, error.stack);
    // Check if it's an ObjectId format error
    if (error.message && error.message.includes('Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid Booking ID format.',
        error: error.message
      }, { status: 400 });
    }
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete booking.', 
      error: error.message 
    }, { status: 500 });
  }
}

// Helper function to check admin authentication
const isAdminRequest = (request) => {
  // For client-side authentication, we should check for the auth cookie
  // This is a simplified version - in production, use a proper token-based auth system
  const authCookie = request.cookies.get('vibeAdminAuth');
  
  // We also need to check the Authorization header for API requests from the admin panel
  const authHeader = request.headers.get('Authorization');
  
  // For this example, we're allowing both cookie and Authorization header
  // This would be more secure in a real-world scenario
  return authCookie?.value === 'true' || authHeader === 'Bearer VibeAdmin';
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const date = searchParams.get('date');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    
    // Import ObjectId only once
    const { ObjectId } = require('mongodb');
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('vibesurfschool');
    const bookingsCollection = db.collection('bookings');
    
    // If ID is provided, fetch a single booking
    if (id) {
      try {
        const booking = await bookingsCollection.findOne({ _id: new ObjectId(id) });
        
        if (!booking) {
          return NextResponse.json({ 
            success: false, 
            message: 'Booking not found' 
          }, { status: 404 });
        }
        
        return NextResponse.json({ 
          success: true, 
          booking 
        });
      } catch (error) {
        console.error('Error fetching booking by ID:', error);
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid booking ID format' 
        }, { status: 400 });
      }
    }
    
    // Otherwise, fetch bookings by date or date range
    if (!date && !(start && end)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Date or start/end parameters are required if no ID is provided' 
      }, { status: 400 });
    }
    
    // We already have the MongoDB connection above, no need to reconnect

    let bookings = [];
    if (start && end) {
      // Find bookings in date range (inclusive)
      const startDate = new Date(start);
      const endDate = new Date(end);
      // endDate + 1 day to make range inclusive
      endDate.setDate(endDate.getDate() + 1);
      bookings = await bookingsCollection.find({
        date: { $gte: startDate, $lt: endDate },
        status: { $in: ['Confirmed', 'Group Inquiry'] }
      }).toArray();
    } else if (date) {
      // Find bookings for the given date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      bookings = await bookingsCollection.find({
        date: {
          $gte: startOfDay,
          $lte: endOfDay
        },
        status: { $in: ['Confirmed', 'Group Inquiry'] }
      }).toArray();
    }

    console.log('[DEBUG] GET /api/bookings returning bookings:', bookings);

    // Return only essential information for availability checking
    // Return full booking objects for admin calendar
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching availability:', error, error.stack);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch availability data',
      error: error.message
    }, { status: 500 });
  }
}
