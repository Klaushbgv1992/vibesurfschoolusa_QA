import clientPromise from '../../../lib/mongodb.js';

// Example schema for site booking settings
// {
//   site: 'Pompano Beach',
//   leadTimeHours: 48, // or 4, etc.
//   seasonalWindows: [
//     { season: 'summer', startTime: '06:00', endTime: '19:00' },
//     { season: 'winter', startTime: '08:00', endTime: '17:00' }
//   ],
//   blockedDates: ['2025-06-01', '2025-06-02', ...]
// }

export async function GET(request) {
  const url = new URL(request.url);
  const site = url.searchParams.get('site');
  const client = await clientPromise;
  const db = client.db('vibesurfschool');
  const settingsCol = db.collection('siteBookingSettings');
  
  let query = {};
  if (site) query.site = site;
  const settings = await settingsCol.find(query).toArray();
  return Response.json({ success: true, settings });
}

export async function POST(request) {
  const data = await request.json();
  const client = await clientPromise;
  const db = client.db('vibesurfschool');
  const settingsCol = db.collection('siteBookingSettings');
  // Upsert by site
  await settingsCol.updateOne(
    { site: data.site },
    { $set: data },
    { upsert: true }
  );
  return Response.json({ success: true });
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const site = url.searchParams.get('site');
  if (!site) return Response.json({ success: false, message: 'Site required' }, { status: 400 });
  const client = await clientPromise;
  const db = client.db('vibesurfschool');
  const settingsCol = db.collection('siteBookingSettings');
  await settingsCol.deleteOne({ site });
  return Response.json({ success: true });
}
