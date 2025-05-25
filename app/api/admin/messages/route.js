import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper function to check admin authentication
const isAdminRequest = (request) => {
  const referer = request.headers.get('referer') || '';
  console.log('[isAdminRequest] Referer:', referer);

  if (referer.includes('/contact')) {
    console.log('[isAdminRequest] Contact form verification request detected - allowing access via referer.');
    return true;
  }
  
  const authCookie = request.cookies?.get('vibeAdminAuth');
  console.log('[isAdminRequest] Auth Cookie (vibeAdminAuth):', authCookie);
  
  const authHeader = request.headers.get('Authorization');
  console.log('[isAdminRequest] Authorization Header:', authHeader);
  
  const cookieAuthValid = authCookie?.value === 'true';
  const headerAuthValid = authHeader === 'Bearer VibeAdmin';

  if (cookieAuthValid) {
    console.log('[isAdminRequest] Access granted via cookie.');
    return true;
  }
  if (headerAuthValid) {
    console.log('[isAdminRequest] Access granted via Authorization header.');
    return true;
  }
  
  console.log('[isAdminRequest] Access denied. Cookie valid:', cookieAuthValid, 'Header valid:', headerAuthValid);
  return false;
};

// GET messages (all or for a specific booking)
export async function GET(request) {
  try {
    // Verify admin request
    if (!isAdminRequest(request)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('vibesurfschool');
    const messagesCollection = db.collection('messages');
    
    // Build query based on parameters
    let query = {};
    
    if (bookingId) {
      query.bookingId = bookingId;
    }
    
    if (unreadOnly) {
      query.status = 'unread';
    }
    
    console.log('Messages query:', JSON.stringify(query));
    
    // Get messages based on query
    const messages = await messagesCollection.find(query)
      .sort({ createdAt: -1 })
      .limit(unreadOnly ? 50 : 100) // Adjust limit based on query type
      .toArray();
    
    // Add debug info
    console.log(`Found ${messages.length} messages${unreadOnly ? ' (unread only)' : ''}`);
    if (messages.length > 0) {
      console.log('Sample message:', JSON.stringify(messages[0], null, 2));
    }
    
    return NextResponse.json({ 
      success: true, 
      messages 
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch messages', 
      error: error.message 
    }, { status: 500 });
  }
}

// POST a new message
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
    const { bookingId, content, type = 'note', author = 'Admin' } = data;
    
    // Validate required fields
    if (!bookingId || !content) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields (bookingId, content)' 
      }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('vibesurfschool');
    const messagesCollection = db.collection('messages');
    
    // Special case for contact form messages
    if (bookingId === 'contact_form') {
      // Create the message directly without booking validation
      const message = {
        bookingId,
        content,
        type,
        author,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'unread'
      };
      
      const result = await messagesCollection.insertOne(message);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Contact form message created successfully',
        messageId: result.insertedId
      });
    }
    
    // For regular booking messages, verify the booking exists
    const bookingsCollection = db.collection('bookings');
    let booking;
    
    try {
      booking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) });
    } catch (e) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid booking ID format' 
      }, { status: 400 });
    }
    
    if (!booking) {
      return NextResponse.json({ 
        success: false, 
        message: 'Booking not found' 
      }, { status: 404 });
    }
    
    // Create the message
    const message = {
      bookingId,
      content,
      type,
      author,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'unread'
    };
    
    const result = await messagesCollection.insertOne(message);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Message created successfully',
      messageId: result.insertedId
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create message', 
      error: error.message 
    }, { status: 500 });
  }
}

// PATCH update a message
export async function PATCH(request) {
  try {
    // Verify admin request
    if (!isAdminRequest(request)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    const data = await request.json();
    const { messageId, content } = data;
    
    // Validate required fields
    if (!messageId || !content) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields (messageId, content)' 
      }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('vibesurfschool');
    const messagesCollection = db.collection('messages');
    
    // Update the message
    try {
      const result = await messagesCollection.updateOne(
        { _id: new ObjectId(messageId) },
        { 
          $set: { 
            content,
            updatedAt: new Date()
          } 
        }
      );
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ 
          success: false, 
          message: 'Message not found' 
        }, { status: 404 });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Message updated successfully' 
      });
    } catch (e) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid message ID format' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update message', 
      error: error.message 
    }, { status: 500 });
  }
}

// DELETE a message
export async function DELETE(request) {
  try {
    // Verify admin request
    if (!isAdminRequest(request)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    const { bookingId } = await request.json(); // Read bookingId from request body
    
    if (!bookingId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Booking ID is required to delete a conversation' 
      }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('vibesurfschool');
    const messagesCollection = db.collection('messages');
    
    // Delete all messages associated with the bookingId
    const deleteResult = await messagesCollection.deleteMany({
      bookingId: bookingId 
    });

    // It's not necessarily an error if no messages were found for a bookingId,
    // as the conversation might have been empty or already deleted.
    // The client-side optimistic update would have already removed it from view.
    // We'll return success regardless, but log if nothing was deleted.
    if (deleteResult.deletedCount === 0) {
      console.log(`No messages found to delete for bookingId: ${bookingId}, or they were already deleted.`);
    }

    return NextResponse.json({
      success: true,
      message: 'Conversation deleted successfully',
      deletedCount: deleteResult.deletedCount
    });
    // Removed the try-catch for ObjectId conversion as we are not using messageId anymore
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete message', 
      error: error.message 
    }, { status: 500 });
  }
}
