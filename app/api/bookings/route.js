import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { checkAvailability, createBooking } from '../../../models/booking';

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
          endTime
        });
        console.log('Group booking confirmation email sent to', clientEmail);
      } catch (emailErr) {
        console.error('Failed to send group booking confirmation email:', emailErr);
        // Do not fail the booking if email fails
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
        endTime
      });
      console.log('Booking confirmation email sent to', clientEmail);
    } catch (emailErr) {
      console.error('Failed to send booking confirmation email:', emailErr);
      // Do not fail the booking if email fails
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
  // PATCH /api/bookings - update revenue for a booking
  try {
    const { id, revenue } = await request.json();
    if (!id || typeof revenue !== 'number') {
      return NextResponse.json({ success: false, message: 'Booking ID and numeric revenue are required.' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db('vibesurfschool');
    const bookingsCollection = db.collection('bookings');
    const { ObjectId } = require('mongodb');
    const result = await bookingsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { revenue } },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return NextResponse.json({ success: false, message: 'Booking not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, booking: result.value });
  } catch (error) {
    console.error('Error updating booking revenue:', error, error.stack);
    return NextResponse.json({ success: false, message: 'Failed to update revenue.', error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  // Enhanced logging for debugging
  console.log('GET /api/bookings called');
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    console.log('GET /api/bookings?date=', date);
    
    if (!date && !(start && end)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Date or start/end parameters are required' 
      }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('vibesurfschool');
    const bookingsCollection = db.collection('bookings');

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
