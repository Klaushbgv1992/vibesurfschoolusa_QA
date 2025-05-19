// Backfill revenue field for existing bookings in MongoDB
// Usage: node scripts/backfill_revenue.js

const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vibesurfschool'; // adjust if needed

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('vibesurfschool');
    const bookings = db.collection('bookings');
    const all = await bookings.find({}).toArray();
    let updated = 0;

    for (const b of all) {
      // Only update if revenue is missing or zero and not a group inquiry
      if ((b.revenue === undefined || b.revenue === 0) && b.status !== 'Group Inquiry') {
        let price = 0;
        if (b.activity && typeof b.activity === 'object' && typeof b.activity.price === 'number') {
          price = b.activity.price;
        } else if (b.activity && !isNaN(Number(b.activity.price))) {
          price = Number(b.activity.price);
        }
        const numParticipants = parseInt(b.participants) || 1;
        const revenue = price * numParticipants;
        await bookings.updateOne({ _id: b._id }, { $set: { revenue } });
        updated++;
      }
    }
    console.log(`Backfill complete. Updated ${updated} bookings.`);
  } finally {
    await client.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
