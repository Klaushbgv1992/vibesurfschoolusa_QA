// app/lib/paypal-utils.js

// Helper function to parse JSON or return text for better error insights
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

export async function getPayPalAccessTokenAndBase() {
  const isLive = process.env.PAYPAL_ENV === 'live';
  const base = isLive
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('PayPal credentials missing in getPayPalAccessTokenAndBase:', { clientId: !!clientId, clientSecret: !!clientSecret });
    // Throw an error that can be caught by the API route and turned into a 500 response
    const err = new Error('PayPal credentials missing. Please check server configuration.');
    err.status = 500; // Internal Server Error
    throw err;
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

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
    console.error('PayPal Auth Error in getPayPalAccessTokenAndBase:', tokenData.error_text || tokenData);
    const errorDetails = tokenData.error_text 
      ? { message: "PayPal returned non-JSON response during auth", raw: tokenData.error_text.substring(0, 500) } 
      : tokenData;
    // Throw an error that can be caught by the API route
    const error = new Error('Failed to authenticate with PayPal.');
    error.details = errorDetails;
    error.status = tokenRes.status || 400;
    throw error;
  }

  return { accessToken: tokenData.access_token, base };
}
