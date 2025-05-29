// app/api/paypal/route.js (Order Creation)
import { NextResponse } from 'next/server';
import { getPayPalAccessTokenAndBase } from '../../lib/paypal-utils'; // Adjusted path

// Helper function (can be moved to utils if used elsewhere or kept here if specific)
async function getJsonResponseOrText(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return { error_text: text }; 
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, currency = 'USD' } = body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json({ error: 'Invalid amount specified.' }, { status: 400 });
    }

    const { accessToken, base } = await getPayPalAccessTokenAndBase();

    // Create PayPal order
    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: String(parseFloat(amount).toFixed(2)), // Ensure amount is a string with 2 decimal places
            },
          },
        ],
      }),
    });
    const orderData = await getJsonResponseOrText(orderRes);

    if (!orderRes.ok || orderData.error_text || !orderData.id) {
      console.error('PayPal Order Creation Error:', orderData.error_text || orderData);
      const details = orderData.error_text 
        ? { message: "PayPal returned non-JSON response during order creation", raw: orderData.error_text.substring(0,500) } 
        : orderData;
      return NextResponse.json({ error: 'Failed to create PayPal order', details }, { status: orderRes.status || 400 });
    }

    return NextResponse.json(orderData);
  } catch (err) {
    console.error('PayPal Order Creation API Route Server Error:', err.message, err.details ? err.details : '', err.status ? `Status: ${err.status}`: '');
    if (err instanceof SyntaxError && err.message.includes("JSON at position") && req?.headers?.get('content-type')?.includes('application/json')) {
        return NextResponse.json({ error: 'Invalid request body: not valid JSON.', details: err.message }, { status: 400 });
    }
    // If the error came from getPayPalAccessTokenAndBase, it might have a status and details
    const status = err.status || 500;
    const details = err.details || err.message || 'An unexpected error occurred.';
    return NextResponse.json({ error: 'Server error processing PayPal order request', details }, { status });
  }
}
