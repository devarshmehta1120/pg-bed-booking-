// utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, text, html, attachmentPath }) => {
  if (!to) throw new Error("No recipient email provided ❌");

  const mailOptions = {
    from: `"PG Booking System" <${process.env.EMAIL}>`,
    to,
    subject,
    text,
    html,
  };

  // ✅ Only attach if exists
  if (attachmentPath) {
    mailOptions.attachments = [
      {
        filename: "booking-receipt.pdf",
        path: attachmentPath,
      },
    ];
  }

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;