import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Hard-coded credentials - in a real app, these would be stored securely
// and likely hashed in a database
const ADMIN_USERNAME = 'VibeAdmin';
const ADMIN_PASSWORD = 'Vibe1630!';

export async function POST(request) {
  try {
    const data = await request.json();
    const { username, password } = data;
    
    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set a secure cookie for the admin authentication
      // This will be used by the API routes to validate admin requests
      cookies().set('vibeAdminAuth', 'true', {
        path: '/', // Make cookie available for all paths
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Authentication successful' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid username or password' 
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Authentication failed',
      error: error.message
    }, { status: 500 });
  }
}

// For logging out - clearing the cookie
export async function DELETE() {
  cookies().delete('vibeAdminAuth');
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
