import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Simple in-memory store for rate limiting
// In production, consider using Redis or another persistent store
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: it => 5, // Limit each IP to 5 requests per windowMs
  cache: new Map(),
};

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Function to sanitize user input to prevent XSS
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    const now = Date.now();
    const windowStart = now - rateLimit.windowMs;
    
    // Clean up expired entries
    for (const [key, timestamps] of rateLimit.cache.entries()) {
      const filtered = timestamps.filter(ts => ts > windowStart);
      if (filtered.length === 0) {
        rateLimit.cache.delete(key);
      } else {
        rateLimit.cache.set(key, filtered);
      }
    }
    
    // Get existing timestamps for this IP
    const timestamps = rateLimit.cache.get(ip) || [];
    
    // Check if rate limit exceeded
    if (timestamps.length >= rateLimit.maxRequests) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: 'Too many requests, please try again later' },
        { status: 429 }
      );
    }
    
    // Add current timestamp and update cache
    timestamps.push(now);
    rateLimit.cache.set(ip, timestamps);

    const { name, email, message } = await request.json();
    
    // Enhanced validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }
    
    // Validate message length
    if (message.length < 10 || message.length > 1000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 1000 characters' },
        { status: 400 }
      );
    }
    
    // Sanitize inputs to prevent XSS
    const sanitizedName = sanitizeInput(name);
    const sanitizedMessage = sanitizeInput(message);

    // Check if email password is configured (without logging sensitive details)
    if (!process.env.EMAIL_PASSWORD) {
      console.error('EMAIL_PASSWORD environment variable is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Configure nodemailer with your email provider
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: 'vibesurfschoolftl@gmail.com',
        pass: process.env.EMAIL_PASSWORD.replace(/\s+/g, ''),
      },
      debug: true, // Enable debug output
      logger: true  // Logger for debug messages
    });

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return NextResponse.json(
        { error: 'Failed to verify email server connection: ' + verifyError.message },
        { status: 500 }
      );
    }

    // Email content with sanitized inputs
    const mailOptions = {
      from: `"Vibe Surf School Website" <vibesurfschoolftl@gmail.com>`, // Use your own email as sender
      replyTo: email, // Set reply-to as the visitor's email
      to: 'vibesurfschoolftl@gmail.com',
      subject: `New Surf Lesson Inquiry from ${sanitizedName}`,
      text: `
        Name: ${sanitizedName}
        Email: ${email}
        
        Message:
        ${sanitizedMessage}
      `,
      html: `
        <h3>New Surf Lesson Inquiry</h3>
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedMessage}</p>
      `,
    };

    // Send the email
    console.log('Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);

    return NextResponse.json(
      { message: 'Email sent successfully', messageId: info.messageId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email: ' + error.message },
      { status: 500 }
    );
  }
}