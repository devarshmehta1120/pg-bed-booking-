import { useParams, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { useNavigate } from "@tanstack/react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  getBedCalendar,
  createBooking,
  verifyPayment,
} from "../api/bookingApi";
import { getBedById } from "../api/bedApi";

const socket = io("http://localhost:5000");

/* ✅ ADD THIS HELPER */
const getImageUrl = (img) => {
  if (!img) return "";

  if (img.startsWith("http")) {
    return img; // Cloudinary
  }

  return `http://localhost:5000${img}`; // Local
};

function BookBed() {
  const navigate = useNavigate();
  const { bedId } = useParams({ strict: false });
  const { roomId } = useSearch({ strict: false });

  const queryClient = useQueryClient();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  /* ---------------- BED DETAILS ---------------- */
  const { data: bed, isLoading } = useQuery({
    queryKey: ["bed", bedId],
    queryFn: () => getBedById(bedId),
    enabled: !!bedId,
  });

  const pricePerBed = bed?.room?.pricePerBed || 0;

  /* ---------------- CALENDAR ---------------- */
  const { data: bookedDates = [] } = useQuery({
    queryKey: ["calendar", bedId],
    queryFn: async () => {
      const data = await getBedCalendar(bedId);
      return data.map((b) => ({
        start: new Date(b.startDate),
        end: new Date(b.endDate),
      }));
    },
    enabled: !!bedId,
  });

  /* ---------------- SOCKET AUTO REFRESH ---------------- */
  useEffect(() => {
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ["calendar", bedId] });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    };

    socket.on("bedBooked", refresh);
    socket.on("bookingUpdated", refresh);

    return () => {
      socket.off("bedBooked", refresh);
      socket.off("bookingUpdated", refresh);
    };
  }, [bedId, queryClient]);

  /* ---------------- DISABLED DATES ---------------- */
  const disabledDates = bookedDates.flatMap((range) => {
    const dates = [];
    let current = new Date(range.start);

    while (current < new Date(range.end)) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  });

  /* ---------------- PRICE ---------------- */
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  };

  const totalPrice = calculateDays() * pricePerBed;

  /* ---------------- DATE FORMAT ---------------- */
  const format = (date, type) => {
    const d = new Date(date);

    if (type === "start") {
      d.setHours(12, 0, 0, 0);
    } else {
      d.setHours(11, 0, 0, 0);
    }

    return d.toISOString();
  };

  /* ---------------- RAZORPAY ---------------- */
  const openRazorpay = (order, bookingId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,

      handler: async (response) => {
        const toastId = toast.loading("Verifying payment...");

        try {
          await verifyPayment({
            bookingId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
          queryClient.invalidateQueries({ queryKey: ["calendar", bedId] });

          toast.update(toastId, {
            render: "🎉 Booking Confirmed!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });

        } catch (err) {
          toast.update(toastId, {
            render: err.message || "Payment failed",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      },

      modal: {
        ondismiss: () => {
          toast.error("Payment cancelled");
        },
      },
    };

    new window.Razorpay(options).open();
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  /* ---------------- BOOKING ---------------- */
  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to continue");

        navigate({
          to: "/login",
          search: {
            redirect: `/book-bed?bedId=${bedId}&roomId=${roomId}`,
          },
        });

        return;
      }

      if (!startDate || !endDate) {
        return toast.error("Select dates first");
      }

      const razorLoaded = await loadRazorpayScript();
      if (!razorLoaded) {
        return toast.error("Razorpay failed to load");
      }

      const toastId = toast.loading("Creating booking...");

      const res = await createBooking({
        room: roomId,
        bed: bedId,
        startDate: format(startDate, "start"),
        endDate: format(endDate, "end"),
        amount: totalPrice,
      });

      queryClient.invalidateQueries({ queryKey: ["calendar", bedId] });

      toast.update(toastId, {
        render: "Redirecting to payment...",
        type: "info",
        isLoading: false,
        autoClose: 1500,
      });

      openRazorpay(res.order, res.bookingId);

    } catch (err) {
      toast.error(err.message || "Booking failed");
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">Book Bed</h1>

      {/* BED INFO */}
      {bed && (
        <div className="border rounded-xl p-4 shadow-md mb-6 flex gap-4">
          <img
            src={getImageUrl(bed.image)}
            alt="bed"
            className="w-32 h-32 object-cover rounded-lg"
          />

          <div>
            <p className="font-semibold text-lg">Bed: {bed.bedNumber}</p>
            <p>Room: {bed.room?.roomNumber}</p>
            <p className="text-green-600">
              ₹{bed.room?.pricePerBed} / day
            </p>

            <p className="text-sm text-gray-500">
              ⏰ Check-in 12 PM | Check-out 11 AM
            </p>
          </div>
        </div>
      )}

      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          const [start, end] = update;
          setStartDate(start);
          setEndDate(end);
        }}
        minDate={new Date()}
        excludeDates={disabledDates}
        inline
      />

      {startDate && endDate && (
        <p className="mt-3 text-green-600">
          {startDate.toDateString()} → {endDate.toDateString()}
        </p>
      )}

      <div className="mt-4">
        <p>Days: {calculateDays()}</p>
        <p className="font-bold text-lg">₹{totalPrice}</p>
      </div>

      <button
        onClick={handleBooking}
        disabled={!startDate || !endDate}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
      >
        Pay & Book
      </button>

    </div>
  );
}

export default BookBed;