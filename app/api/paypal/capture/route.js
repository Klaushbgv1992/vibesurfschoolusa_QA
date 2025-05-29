// app/api/paypal/capture/route.js
import { NextResponse } from 'next/server';
import { getPayPalAccessTokenAndBase } from '../../../lib/paypal-utils'; // Adjusted path relative to capture folder

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
    const { orderID } = body;

    if (!orderID) {
      return NextResponse.json({ error: 'Missing orderID in request body.' }, { status: 400 });
    }

    const { accessToken, base } = await getPayPalAccessTokenAndBase();

    // Capture PayPal order
    // Note: The PayPal SDK might require an empty JSON body {} for capture, or no body at all.
    // Check PayPal documentation for /v2/checkout/orders/${orderID}/capture endpoint specifics.
    // For now, sending an empty JSON body as it's common.
    const captureRes = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        // PayPal-Request-Id is optional but good for idempotency if needed
        // 'PayPal-Request-Id': `capture-${orderID}-${Date.now()}` 
      },
      body: JSON.stringify({}) // Often, capture requests require an empty JSON body or no body.
    });

    const captureData = await getJsonResponseOrText(captureRes);

    if (!captureRes.ok || captureData.error_text) {
      console.error('PayPal Capture Error:', captureData.error_text || captureData);
      const details = captureData.error_text 
        ? { message: "PayPal returned non-JSON response during capture", raw: captureData.error_text.substring(0,500) } 
        : captureData;
      return NextResponse.json({ error: 'Failed to capture PayPal payment', details }, { status: captureRes.status || 400 });
    }

    // Potentially save booking to database here after successful capture
    // For example: await saveBookingToDatabase(orderID, captureData, ...otherBookingDetails);
    console.log('Payment captured successfully:', captureData);

    return NextResponse.json(captureData);

  } catch (err) {
    console.error('PayPal Capture API Route Server Error:', err.message, err.details ? err.details : '', err.status ? `Status: ${err.status}`: '');
    if (err instanceof SyntaxError && err.message.includes("JSON at position") && req?.headers?.get('content-type')?.includes('application/json')) {
        return NextResponse.json({ error: 'Invalid request body: not valid JSON.', details: err.message }, { status: 400 });
    }
    const status = err.status || 500;
    const details = err.details || err.message || 'An unexpected error occurred during payment capture.';
    return NextResponse.json({ error: 'Server error processing PayPal capture request', details }, { status });
  }
}
