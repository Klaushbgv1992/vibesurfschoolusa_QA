import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import nodemailer from 'nodemailer';

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
    // Parse the request body
    let data;
    try {
      data = await request.json();
      console.log('Received contact form data:', data);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    const { name, email, message, cellphone } = data; // Added cellphone
    
    // Basic validation
    if (!name || !email || !cellphone || !message) { // Added cellphone to validation
      console.log('Missing required fields:', { name, email, cellphone, message });
      return NextResponse.json(
        { error: 'Name, email, cellphone, and message are required' }, // Updated error message
        { status: 400 }
      );
    }
    
    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedMessage = sanitizeInput(message);
    const sanitizedCellphone = sanitizeInput(cellphone); // Cellphone is now required

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('vibesurfschool');
    const messagesCollection = db.collection('messages');
    
    // Create a unique ID for this contact person - use their name and email as a unique identifier
    // This ensures each person has their own conversation thread
    const namePart = sanitizedName.replace(/[^a-zA-Z0-9]/g, '_');
    const emailPart = email.replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueContactId = `contact_${namePart}_${emailPart}`;
    
    // Create the message object
    const messageData = {
      type: 'contact',
      author: sanitizedName,
      content: sanitizedMessage,
      email: email,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'unread',
      bookingId: uniqueContactId,
      cellphone: sanitizedCellphone, // Cellphone is now required
    };
    
    // Save message to database
    const result = await messagesCollection.insertOne(messageData);
    console.log('Contact form message saved to database:', result.insertedId);

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"Vibe Surf School Contact" <${process.env.GMAIL_EMAIL}>`,
        to: process.env.NOTIFICATION_EMAIL,
        subject: 'New Contact Form Submission - Vibe Surf School',
        html: `
          <p>You have a new contact form submission:</p>
          <ul>
            <li><strong>Name:</strong> ${sanitizedName}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Cellphone:</strong> ${sanitizedCellphone}</li>
            <li><strong>Message:</strong></li>
            <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
          </ul>
          <p>Please check the admin messages section for more details:</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings?tab=messages">${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings?tab=messages</a></p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log('Notification email sent successfully to:', process.env.NOTIFICATION_EMAIL);
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Do not block the user response if email fails, just log the error
    }
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Message received successfully. Our team will get back to you soon!',
        messageId: result.insertedId.toString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process your message. Please try again later.'
      },
      { status: 500 }
    );
  }
}