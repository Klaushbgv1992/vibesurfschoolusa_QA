import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();
    
    console.log('Received contact form submission:', { name, email });

    // Basic validation
    if (!name || !email || !message) {
      console.log('Validation failed:', { name, email, message });
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }

    // Debug environment variables
    console.log('Email credentials available:', {
      emailUser: 'vibesurfshcoolftl@gmail.com',
      emailPasswordExists: !!process.env.EMAIL_PASSWORD,
      emailPasswordLength: process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0
    });

    // Configure nodemailer with your email provider
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: 'vibesurfshcoolftl@gmail.com',
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

    // Email content
    const mailOptions = {
      from: `"Vibe Surf School Website" <vibesurfshcoolftl@gmail.com>`, // Use your own email as sender
      replyTo: email, // Set reply-to as the visitor's email
      to: 'vibesurfshcoolftl@gmail.com',
      subject: `New Surf Lesson Inquiry from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
      html: `
        <h3>New Surf Lesson Inquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
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