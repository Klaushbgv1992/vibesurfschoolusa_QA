import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper function to check admin authentication
const isAdminRequest = (request) => {
  // For development/testing, we're allowing automatic verification from the contact form
  // Check if the request is coming from the contact form verification
  const referer = request.headers.get('referer') || '';
  if (referer.includes('/contact') || referer.includes('/admin')) {
    console.log('Admin verification request detected - allowing access');
    return true;
  }
  
  // For client-side authentication, check for the auth cookie
  const authCookie = request.cookies.get('vibeAdminAuth');
  
  // Also check the Authorization header for API requests from the admin panel
  const authHeader = request.headers.get('Authorization');
  
  // Allow both cookie and Authorization header
  return authCookie?.value === 'true' || authHeader === 'Bearer VibeAdmin';
};

// POST to mark messages as read for a specific booking
export async function POST(request) {
  try {
    // Verify admin request
    if (!isAdminRequest(request)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    const data = await request.json();
    const { bookingId } = data;
    
    if (!bookingId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Booking ID is required' 
      }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('vibesurfschool');
    const messagesCollection = db.collection('messages');
    
    // Check if this is a contact form message or a regular booking
    const isContactMessage = bookingId.startsWith('contact_');
    let query;
    
    if (isContactMessage) {
      // For contact messages, just use the bookingId directly
      query = {
        bookingId: bookingId,
        status: 'unread'
      };
    } else {
      // For regular bookings, try to use ObjectId
      try {
        query = {
          bookingId: bookingId,
          status: 'unread'
        };
      } catch (error) {
        console.error('Invalid booking ID format:', error);
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid booking ID format' 
        }, { status: 400 });
      }
    }
    
    console.log('Marking messages as read with query:', JSON.stringify(query));
    
    // Update all unread messages for this booking to read status
    const result = await messagesCollection.updateMany(
      query,
      { 
        $set: { 
          status: 'read',
          updatedAt: new Date()
        } 
      }
    );
    
    console.log(`Marked ${result.modifiedCount} messages as read for booking ${bookingId}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Marked ${result.modifiedCount} messages as read`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to mark messages as read', 
      error: error.message 
    }, { status: 500 });
  }
}
