import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Check for cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Call the generate-post API
    const response = await fetch(new URL('/api/generate-post', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate post');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog post generated successfully',
      post: data.post,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to run cron job' },
      { status: 500 }
    );
  }
}