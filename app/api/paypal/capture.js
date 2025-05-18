import { NextResponse } from 'next/server';

// Helper to get PayPal access token
async function getPayPalAccessToken() {
  const isLive = process.env.PAYPAL_ENV === 'live';
  const base = isLive
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || 'Failed to get PayPal access token');
  return data.access_token;
}

export async function POST(req) {
  try {
    const { orderID } = await req.json();
    if (!orderID) {
      return NextResponse.json({ error: 'Missing orderID' }, { status: 400 });
    }

    const isLive = process.env.PAYPAL_ENV === 'live';
    const base = isLive
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
    const accessToken = await getPayPalAccessToken();

    // Capture the order
    const captureRes = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const captureData = await captureRes.json();
    if (!captureRes.ok || captureData.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Payment not completed', details: captureData }, { status: 400 });
    }
    // Optionally, return payer info, amount, etc.
    return NextResponse.json({ success: true, details: captureData });
  } catch (err) {
    return NextResponse.json({ error: 'Server error', details: err.message }, { status: 500 });
  }
}
