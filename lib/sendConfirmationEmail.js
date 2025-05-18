import nodemailer from 'nodemailer';

export async function sendConfirmationEmail({
  to,
  clientName,
  beach,
  activity,
  date,
  startTime,
  endTime
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

  const mailOptions = {
    from: 'Vibe Surf School <info@vibesurfschool.com>',
    to,
    subject: 'Your Surf Lesson Booking Confirmation',
    text: `Hi ${clientName},\n\nThank you for booking with Vibe Surf School!\n\nYour booking is confirmed for:\n- Date: ${formattedDate}\n- Time: ${startTime} to ${endTime}\n- Location: ${beach?.name || beach}\n- Activity: ${activity?.name || activity}\n\nWe look forward to seeing you!\n\nIf you have any questions, just reply to this email.\n\nVibe Surf School Team`,
    html: `<p>Hi <strong>${clientName}</strong>,</p><p>Thank you for booking with <b>Vibe Surf School</b>!</p><p>Your booking is confirmed for:</p><ul><li><b>Date:</b> ${formattedDate}</li><li><b>Time:</b> ${startTime} to ${endTime}</li><li><b>Location:</b> ${beach?.name || beach}</li><li><b>Activity:</b> ${activity?.name || activity}</li></ul><p>We look forward to seeing you!</p><p>If you have any questions, just reply to this email.<br/><br/>Vibe Surf School Team</p>`
  };

  await transporter.sendMail(mailOptions);
}
