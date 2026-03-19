const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateReceipt = (booking, user, room, bed) => {

  // receipts folder path
  const receiptsDir = path.join(__dirname, "../receipts");

  // create folder if it does not exist
  if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir);
  }

  // receipt file path
  const filePath = path.join(
    receiptsDir,
    `booking-${booking._id}.pdf`
  );

  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  // Title
  doc.fontSize(22).text("PG Bed Booking Receipt", { align: "center" });

  doc.moveDown();

  // Booking details
  doc.fontSize(14).text(`Booking ID: ${booking._id}`);
  doc.text(`User: ${user.name}`);
  doc.text(`Email: ${user.email}`);

  doc.moveDown();

  // Room & Bed details
  doc.text(`Room: ${room.roomNumber}`);
  doc.text(`Bed: ${bed.bedNumber}`);

  doc.moveDown();

  // Booking dates
  doc.text(`Start Date: ${booking.startDate}`);
  doc.text(`End Date: ${booking.endDate}`);

  doc.moveDown();

  // Payment
  doc.text(`Total Amount: ₹${booking.amount}`);
  doc.text("Payment Status: Paid");

  doc.moveDown();

  doc.text("Thank you for booking with us!", { align: "center" });

  doc.end();

  return filePath;
};

module.exports = generateReceipt;