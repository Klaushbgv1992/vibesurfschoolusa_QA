// Booking schema for the bookings collection
export const BookingSchema = {
  clientName: String,
  clientEmail: String,
  clientPhone: String,
  beach: String, // e.g., "Fort Lauderdale", "Pompano Beach"
  activity: String, // e.g., "Group Surf Lesson", "Private Surf Lesson", "Paddleboard Rental"
  date: Date,
  startTime: String, // e.g., "09:00"
  endTime: String, // e.g., "11:00"
  participants: Number,
  status: {
    type: String,
    default: 'Confirmed', // Confirmed, Cancelled, Completed
  },
  notes: {
    type: String,
    default: '',
  },
  revenue: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  }
};

// Export function to check for availability
export async function checkAvailability(collection, beach, activity, date, startTime, endTime) {
  console.log('[checkAvailability] Input Params:', { beach, activity, date, startTime, endTime });

  const linkedBeaches = ["Sunny Isles Beach", "Dania Beach"]; // Beaches to link
  let beachQueryCondition;

  if (linkedBeaches.includes(beach)) {
    // If the requested beach is one of the linked beaches, check for bookings in EITHER linked beach.
    beachQueryCondition = { $in: linkedBeaches };
    console.log(`[checkAvailability] Beach '${beach}' is linked. Querying for beaches:`, linkedBeaches);
  } else {
    // Otherwise, check for bookings only in the specified beach.
    beachQueryCondition = beach;
    console.log(`[checkAvailability] Beach '${beach}' is not linked. Querying for this beach only.`);
  }
  console.log('[checkAvailability] Beach Query Condition:', JSON.stringify(beachQueryCondition));

  const query = {
    beach: beachQueryCondition, // Use the modified condition here
    activity,
    date: new Date(date),
    status: { $in: ['Confirmed', 'Group Inquiry'] }, // Assuming these statuses make a slot unavailable
    $or: [
      // Check if new booking starts during an existing booking
      { 
        startTime: { $lte: startTime },
        endTime: { $gt: startTime }
      },
      // Check if new booking ends during an existing booking
      {
        startTime: { $lt: endTime },
        endTime: { $gte: endTime }
      },
      // Check if new booking completely contains an existing booking
      {
        startTime: { $gte: startTime },
        endTime: { $lte: endTime }
      }
    ]
  };
  console.log('[checkAvailability] MongoDB Query:', JSON.stringify(query));

  const existingBookings = await collection.find(query).toArray();
  console.log('[checkAvailability] Found existing bookings:', existingBookings.length, existingBookings);
  
  return existingBookings.length === 0;
}

// Export function to create a new booking
export async function createBooking(collection, bookingData) {
  const result = await collection.insertOne({
    ...bookingData,
    revenue: bookingData.revenue !== undefined ? bookingData.revenue : 0,
    date: new Date(bookingData.date),
    created: new Date()
  });
  
  return result;
}

// Export function to get bookings for a specific date
export async function getBookingsByDate(collection, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const bookings = await collection.find({
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  }).sort({ startTime: 1 }).toArray();
  
  return bookings;
}

// Export function to get a booking by ID
export async function getBookingById(collection, id) {
  const ObjectId = require('mongodb').ObjectId;
  return await collection.findOne({ _id: new ObjectId(id) });
}
