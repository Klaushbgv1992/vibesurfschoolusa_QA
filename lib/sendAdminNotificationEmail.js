import nodemailer from 'nodemailer';

export async function sendAdminNotificationEmail({
  action, // e.g., 'Rescheduled', 'Modified', 'Deleted'
  bookingDetails, // The full booking object
  adminEmail, // The admin email address to send to
  reason // Optional: reason for modification/cancellation if provided
}) {
  if (!process.env.GMAIL_APP_PASSWORD) {
    console.error('GMAIL_APP_PASSWORD environment variable is not configured');
    throw new Error('GMAIL_APP_PASSWORD environment variable is not configured');
  }
  console.log(`[sendAdminNotificationEmail] Received adminEmail parameter: ${adminEmail}`); // Log the received adminEmail
  if (!adminEmail) {
    console.error('Admin email is not provided for notification');
    throw new Error('Admin email is not provided for notification');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 465,
    secure: process.env.EMAIL_SECURE === 'false' ? false : true, // true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_EMAIL || 'info@vibesurfschool.com',
      pass: process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, ''), // Ensure no leading/trailing spaces in password
    },
  });

  const formattedDate = bookingDetails.date ? new Date(bookingDetails.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
  const bookingId = bookingDetails._id || bookingDetails.id || 'N/A';

  let subject = `Admin Notification: Booking ${action}`;
  let htmlContent = `<p>Hello Admin,</p>
                     <p>This is a notification that a booking has been <strong>${action}</strong>.</p>
                     <p><strong>Booking ID:</strong> ${bookingId}</p>
                     <p><strong>Client Name:</strong> ${bookingDetails.clientName || 'N/A'}</p>
                     <p><strong>Client Email:</strong> ${bookingDetails.clientEmail || 'N/A'}</p>
                     <p><strong>Client Phone:</strong> ${bookingDetails.clientPhone || 'N/A'}</p>
                     <p><strong>Activity:</strong> ${bookingDetails.activity?.name || bookingDetails.activity || 'N/A'}</p>
                     <p><strong>Beach:</strong> ${bookingDetails.beach?.name || bookingDetails.beach || 'N/A'}</p>
                     <p><strong>Date:</strong> ${formattedDate}</p>
                     <p><strong>Time:</strong> ${bookingDetails.startTime || 'N/A'} - ${bookingDetails.endTime || 'N/A'}</p>`;

  if (reason) {
    htmlContent += `<p><strong>Reason:</strong> ${reason}</p>`;
  }

  htmlContent += `<p>Please review the changes in the admin dashboard if necessary.</p>
                  <p>Vibe Surf School Admin System</p>`;
  
  let textContent = `Hello Admin,\n\nThis is a notification that a booking has been ${action}.\n\nBooking ID: ${bookingId}
Client Name: ${bookingDetails.clientName || 'N/A'}
Client Email: ${bookingDetails.clientEmail || 'N/A'}
Client Phone: ${bookingDetails.clientPhone || 'N/A'}\nActivity: ${bookingDetails.activity?.name || bookingDetails.activity || 'N/A'}\nBeach: ${bookingDetails.beach?.name || bookingDetails.beach || 'N/A'}\nDate: ${formattedDate}\nTime: ${bookingDetails.startTime || 'N/A'} - ${bookingDetails.endTime || 'N/A'}\n`;

  if (reason) {
    textContent += `Reason: ${reason}\n`;
  }

  textContent += `\nPlease review the changes in the admin dashboard if necessary.\n\nVibe Surf School Admin System`;

  const mailOptions = {
    from: `Vibe Surf School Admin <${process.env.GMAIL_EMAIL || 'info@vibesurfschool.com'}>`,
    to: adminEmail,
    subject: subject,
    text: textContent,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Admin notification email sent successfully to ${adminEmail} for action: ${action}`);
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    // Decide if you want to throw the error or handle it gracefully
    // For now, just logging, as the primary API operation might have succeeded
  }
}
