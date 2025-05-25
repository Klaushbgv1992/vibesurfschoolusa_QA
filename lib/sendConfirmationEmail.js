import nodemailer from 'nodemailer';

export async function sendConfirmationEmail({
  to,
  clientName,
  beach,
  activity,
  date,
  startTime,
  endTime,
  isGroupInquiry = false, // Default to false if not provided
  participants = 1 // Default to 1 if not provided
}) {
  if (!process.env.EMAIL_PASSWORD) {
    throw new Error('EMAIL_PASSWORD environment variable is not configured');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 465,
    secure: process.env.EMAIL_SECURE === 'false' ? false : true,
    auth: {
      user: process.env.EMAIL_USER || 'info@vibesurfschool.com',
      pass: process.env.EMAIL_PASSWORD.replace(/\s+/g, ''),
    },
  });

  const formattedDate = new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  let subject = '';
  let textBody = '';
  let htmlBody = '';

  const isLargeGroupOrInquiry = isGroupInquiry || (participants && parseInt(participants) >= 5);

  if (isLargeGroupOrInquiry) {
    subject = 'Your Vibe Surf School Inquiry Confirmation';
    textBody = `Hi ${clientName},\n\nThank you for your inquiry with Vibe Surf School!\n\nYour inquiry details:\n- Date: ${formattedDate}\n- Time: ${startTime} to ${endTime}\n- Location: ${beach?.name || beach}\n- Activity: ${activity?.name || activity}\n- Participants: ${participants}\n\nOne of our instructors will be reaching out to you soon.\n\nIf you have any immediate questions, please reply to this email.\n\nVibe Surf School Team`;
    htmlBody = `<p>Hi <strong>${clientName}</strong>,</p><p>Thank you for your inquiry with <b>Vibe Surf School</b>!</p><p>Your inquiry details:</p><ul><li><b>Date:</b> ${formattedDate}</li><li><b>Time:</b> ${startTime} to ${endTime}</li><li><b>Location:</b> ${beach?.name || beach}</li><li><b>Activity:</b> ${activity?.name || activity}</li><li><b>Participants:</b> ${participants}</li></ul><p>One of our instructors will be reaching out to you soon.</p><p>If you have any immediate questions, please reply to this email.<br/><br/>Vibe Surf School Team</p>`;
  } else {
    subject = 'Your Vibe Surf School Booking Confirmation';
    textBody = `Hi ${clientName},\n\nThank you for booking with Vibe Surf School!\n\nYour booking is confirmed for:\n- Date: ${formattedDate}\n- Time: ${startTime} to ${endTime}\n- Location: ${beach?.name || beach}\n- Activity: ${activity?.name || activity}\n\nOne of our instructors will be reaching out to you with more details about your lesson, meeting place, and an indemnity form to please fill out.\n\nIf you have any questions, don't hesitate to reach out by replying to this email.\n\nWe look forward to seeing you!\n\nVibe Surf School Team`;
    htmlBody = `<p>Hi <strong>${clientName}</strong>,</p><p>Thank you for booking with <b>Vibe Surf School</b>!</p><p>Your booking is confirmed for:</p><ul><li><b>Date:</b> ${formattedDate}</li><li><b>Time:</b> ${startTime} to ${endTime}</li><li><b>Location:</b> ${beach?.name || beach}</li><li><b>Activity:</b> ${activity?.name || activity}</li></ul><p>One of our instructors will be reaching out to you with more details about your lesson, meeting place, and an indemnity form to please fill out.</p><p>If you have any questions, don't hesitate to reach out by replying to this email.</p><p>We look forward to seeing you!<br/><br/>Vibe Surf School Team</p>`;
  }

  const mailOptions = {
    from: 'Vibe Surf School <info@vibesurfschool.com>',
    to,
    subject: subject,
    text: textBody,
    html: htmlBody
  };

  await transporter.sendMail(mailOptions);
}
