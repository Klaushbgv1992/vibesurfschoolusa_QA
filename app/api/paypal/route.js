// Secure backend API route for PayPal order creation (Next.js API Route)
import { NextResponse } from 'next/server';

console.log('PayPal Client ID:', process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '[MISSING]');
console.log('PayPal Secret:', process.env.PAYPAL_CLIENT_SECRET ? '[SET]' : '[MISSING]');
console.log('PayPal ENV:', process.env.PAYPAL_ENV || '[MISSING]');

// Extra logging for debugging
if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
  console.error('[PayPal Debug] Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID in env!');
}
if (!process.env.PAYPAL_CLIENT_SECRET) {
  console.error('[PayPal Debug] Missing PAYPAL_CLIENT_SECRET in env!');
}
if (!process.env.PAYPAL_ENV) {
  console.error('[PayPal Debug] Missing PAYPAL_ENV in env!');
}
async function getJsonResponseOrText(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    // Not JSON, return the text for logging or specific error handling
    // Return as an object to allow checking for error_text property
    return { error_text: text }; 
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, currency = 'USD' } = body;

    // Determine PayPal environment
    const isLive = process.env.PAYPAL_ENV === 'live';
    const base = isLive
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    // Use secret credentials from env (never expose to client)
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      console.error('PayPal credentials missing:', { clientId: !!clientId, clientSecret: !!clientSecret });
      return NextResponse.json({ error: 'PayPal credentials missing. Please check your .env.local and restart the server.' }, { status: 500 });
    }
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // Get OAuth access token
    const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const tokenData = await getJsonResponseOrText(tokenRes);

    if (!tokenRes.ok || tokenData.error_text || !tokenData.access_token) {
      console.error('PayPal Auth Error:', tokenData.error_text || tokenData);
      const details = tokenData.error_text ? { message: "PayPal returned non-JSON response during auth", raw: tokenData.error_text.substring(0, 500) } : tokenData;
      return NextResponse.json({ error: 'Failed to authenticate with PayPal', details }, { status: tokenRes.status || 400 });
    }

    // Create PayPal order
    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount,
            },
          },
        ],
      }),
    });
    const orderData = await getJsonResponseOrText(orderRes);

    if (!orderRes.ok || orderData.error_text || !orderData.id) {
      console.error('PayPal Order Error:', orderData.error_text || orderData);
      const details = orderData.error_text ? { message: "PayPal returned non-JSON response during order creation", raw: orderData.error_text.substring(0,500) } : orderData;
      return NextResponse.json({ error: 'Failed to create PayPal order', details }, { status: orderRes.status || 400 });
    }

    return NextResponse.json(orderData);
  } catch (err) {
    console.error('PayPal API Route Server Error:', err); // Log the actual error object
    // Check if the error is due to req.json() failing (e.g. client sent malformed JSON)
    if (err instanceof SyntaxError && err.message.includes("JSON at position") && req.headers.get('content-type')?.includes('application/json')) {
        return NextResponse.json({ error: 'Invalid request body: not valid JSON.', details: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error processing PayPal request', details: err.message }, { status: 500 });
  }
}
