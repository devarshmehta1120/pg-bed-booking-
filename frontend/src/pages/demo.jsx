import { useParams, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function BookBed() {
  const { bedId } = useParams({ strict: false });
  const { roomId } = useSearch({ strict: false });

  const queryClient = useQueryClient();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  /* ================= BED DETAILS ================= */
  const { data: bed, isLoading, isError } = useQuery({
    queryKey: ["bed", bedId],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/beds/${bedId}`);
      return res.data.data;
    },
    enabled: !!bedId,
    retry: false,
  });

  useEffect(() => {
    if (isError) toast.error("Failed to load bed details");
  }, [isError]);

  const pricePerBed = bed?.room?.pricePerBed || 0;

  /* ================= BOOKED DATES (ONLY CONFIRMED) ================= */
  const { data: bookedDates = [] } = useQuery({
    queryKey: ["calendar", bedId],
    queryFn: async () => {
      const res = await axios.get(
        `${BASE_URL}/api/bookings/calendar/${bedId}`
      );

      return res.data.data
        .filter((b) => b.bookingStatus === "confirmed")
        .map((b) => ({
          start: new Date(b.startDate),
          end: new Date(b.endDate),
        }));
    },
    enabled: !!bedId,
  });
  /* 🔴 Convert booked ranges → individual disabled dates */
  const bookedDisabledDates = bookedDates.flatMap(({ start, end }) => {
    const dates = [];
    let current = new Date(start);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  });

  /* 🔵 Selected range */
  const selectedDates = [];
  if (startDate && endDate) {
    let current = new Date(startDate);

    while (current <= endDate) {
      selectedDates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  }

  /* 🎨 Highlight */
  const highlightDates = [
    { "react-datepicker__day--booked": bookedDisabledDates },
    { "react-datepicker__day--selected-range": selectedDates },
  ];

  /* ================= PRICE ================= */
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalPrice = calculateDays() * pricePerBed;

  /* ================= RAZORPAY ================= */
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const openRazorpay = (order, bookingId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,

      handler: async (response) => {
        try {
          const token = localStorage.getItem("token");

          await axios.post(
            `${BASE_URL}/api/bookings/verify-payment`,
            {
              bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          toast.success("Payment successful 🎉 Booking confirmed");

          // 🔥 Refresh calendar so dates turn RED
          queryClient.invalidateQueries(["calendar", bedId]);

          // optional reset selection
          setStartDate(null);
          setEndDate(null);

        } catch {
          toast.error("Payment verification failed");
        }
      },
    };

    new window.Razorpay(options).open();
  };

  /* ================= BOOKING ================= */
  const handleBooking = async () => {
    try {
      if (!startDate || !endDate) {
        return toast.error("Select dates");
      }

      if (endDate < startDate) {
        return toast.error("Invalid date range");
      }

      const razorLoaded = await loadRazorpayScript();
      if (!razorLoaded) return toast.error("Payment failed to load");

      const token = localStorage.getItem("token");

      const format = (d) => new Date(d).toISOString().split("T")[0];

      const res = await axios.post(
        `${BASE_URL}/api/bookings/create`,
        {
          room: roomId,
          bed: bedId,
          startDate: format(startDate),
          endDate: format(endDate),
          amount: totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      openRazorpay(res.data.order, res.data.bookingId);

    } catch (err) {
      toast.error(err?.response?.data?.message || "Booking failed");
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6">

        {/* LEFT */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <img
            src={`${BASE_URL}${bed?.image}`}
            className="w-full h-72 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold">
              Room {bed?.room?.roomNumber}
            </h1>
            <p>Bed {bed?.bedNumber}</p>
            <p className="text-blue-600 text-xl font-semibold mt-3">
              ₹{pricePerBed} / Day
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Book Bed</h2>

          <p className="text-sm text-gray-500 mb-2">
            🔴 Booked | 🔵 Selected
          </p>

          <div className="flex gap-4 mb-4">
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              excludeDates={bookedDisabledDates}
              highlightDates={highlightDates}
              minDate={new Date()}
              placeholderText="Start Date"
              className="border p-2 rounded w-full"
            />

            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              excludeDates={bookedDisabledDates}
              highlightDates={highlightDates}
              minDate={startDate || new Date()}
              placeholderText="End Date"
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="mb-4">
            <p>Days: {calculateDays()}</p>
            <p className="font-semibold text-lg">
              Total: ₹{totalPrice}
            </p>
          </div>

          <button
            onClick={handleBooking}
            disabled={!startDate || !endDate}
            className="w-full bg-blue-600 text-white py-3 rounded"
          >
            Pay & Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookBed;