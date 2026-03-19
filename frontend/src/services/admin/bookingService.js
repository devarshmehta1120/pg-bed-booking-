import axios from "axios";

const API = "http://localhost:5000/api/bookings";

export const getAllBookings = async () => {
  try {

    const token = localStorage.getItem("token");

    const res = await axios.get(API, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;

  } catch (error) {

    console.error("Get Bookings Error:", error);

    throw error.response?.data || {
      message: "Failed to fetch bookings"
    };
  }
};


export const getBookingById = async (id) => {
  try {

    const token = localStorage.getItem("token");

    const res = await axios.get(`${API}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;

  } catch (error) {

    console.error("Get Booking Error:", error);

    throw error.response?.data || {
      message: "Failed to fetch booking"
    };
  }
};
export const refundBookingApi = async (id, token) => {
  const res = await axios.put(
    `/refund/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};