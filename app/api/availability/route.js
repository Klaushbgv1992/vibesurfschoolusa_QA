import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { checkAvailability } from '../../../models/booking';

export async function POST(request) {
  try {
    const data = await request.json();
    const { beach, activity, date, startTime, endTime } = data;

    // Validate required fields
    if (!beach || !activity || !date || !startTime || !endTime) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('vibesurfschool');
    const bookingsCollection = db.collection('bookings');

    // Check if the selected time slot is available
    const isAvailable = await checkAvailability(
      bookingsCollection,
      beach,
      activity,
      date,
      startTime,
      endTime
    );

    return NextResponse.json({ 
      success: true, 
      available: isAvailable
    });

  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'There was an error checking availability. Please try again.' 
    }, { status: 500 });
  }
}
