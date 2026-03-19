import axios from "axios";

const API = "http://localhost:5000/api";

/* ---------------- HELPER ---------------- */
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* ---------------- ERROR HANDLER ---------------- */
const handleError = (error, defaultMessage) => {
  let message = defaultMessage;

  if (error.response) {
    message = error.response.data?.message || defaultMessage;
  } else if (error.request) {
    message = "No response from server. Please try again.";
  } else {
    message = error.message || defaultMessage;
  }

  console.error("API Error:", message);
  throw { message };
};


/* ---------------- GET MY BOOKINGS ---------------- */
export const getMyBookings = async () => {
  try {
    const res = await axios.get(
      `${API}/bookings/my-bookings`,
      getAuthConfig()
    );

    return res.data.data;

  } catch (error) {
    handleError(error, "Failed to fetch bookings");
  }
};


/* ---------------- GET ALL BOOKINGS (ADMIN) ---------------- */
export const getAllBookings = async () => {
  try {
    const res = await axios.get(
      `${API}/bookings`,
      getAuthConfig()
    );

    return res.data.data;

  } catch (error) {
    handleError(error, "Failed to fetch bookings");
  }
};


/* ---------------- GET BOOKING BY ID ---------------- */
export const getBookingById = async (id) => {
  try {
    const res = await axios.get(
      `${API}/bookings/${id}`,
      getAuthConfig()
    );

    return res.data.data;

  } catch (error) {
    handleError(error, "Failed to fetch booking");
  }
};


/* ---------------- CANCEL BOOKING ---------------- */
export const cancelBooking = async (id) => {
  try {
    const res = await axios.put(
      `${API}/bookings/cancel/${id}`,
      {},
      getAuthConfig()
    );

    return res.data.data;

  } catch (error) {
    handleError(error, "Failed to cancel booking");
  }
};


/* ---------------- REFUND BOOKING ---------------- */
export const refundBooking = async (id) => {
  try {
    const res = await axios.post(
      `${API}/bookings/refund`,
      { bookingId: id },
      getAuthConfig()
    );

    return res.data.data;

  } catch (error) {
    handleError(error, "Failed to refund booking");
  }
};


/* ---------------- BED CALENDAR ---------------- */
export const getBedCalendar = async (bedId) => {
  try {
    const res = await axios.get(
      `${API}/bookings/calendar/${bedId}`,
      getAuthConfig()
    );

    return res.data.data;

  } catch (error) {
    handleError(error, "Failed to fetch calendar");
  }
};


/* ---------------- CREATE BOOKING ---------------- */
export const createBooking = async (payload) => {
  try {
    const res = await axios.post(
      `${API}/bookings/create`,
      payload,
      getAuthConfig()
    );

    return res.data;

  } catch (error) {
    handleError(error, "Failed to create booking");
  }
};


/* ---------------- VERIFY PAYMENT ---------------- */
export const verifyPayment = async (payload) => {
  try {
    const res = await axios.post(
      `${API}/bookings/verify-payment`,
      payload,
      getAuthConfig()
    );

    return res.data.data;

  } catch (error) {
    handleError(error, "Payment verification failed");
  }
};