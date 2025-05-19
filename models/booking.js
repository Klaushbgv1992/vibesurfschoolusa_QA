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
  const existingBookings = await collection.find({
    beach,
    activity,
    date: new Date(date),
    status: { $in: ['Confirmed', 'Group Inquiry'] },
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
  }).toArray();
  
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
