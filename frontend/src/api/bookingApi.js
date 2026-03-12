import axios from "axios";

const API = "http://localhost:5000/api/bookings";

/**
 * GET BED BOOKING CALENDAR
 */
export const getBedCalendar = async (bedId, token) => {
  try {
    const res = await axios.get(`${API}/calendar/${bedId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;

  } catch (error) {
    console.error("Error fetching bed calendar:", error);

    throw error.response?.data || {
      message: "Failed to fetch bed calendar"
    };
  }
};