import axios from "axios";

const API = "http://localhost:5000/api/beds";


/* ---------------- GET BEDS BY ROOM ---------------- */

export const getBedsByRoom = async (roomId) => {
  try {
    const res = await axios.get(`${API}/room/${roomId}`);
    return res.data;

  } catch (error) {
    console.error("Error fetching beds:", error);

    throw error.response?.data || {
      message: "Failed to fetch beds"
    };
  }
};


/* ---------------- CREATE BED (ADMIN) ---------------- */

export const createBed = async (bedData) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(`${API}/create`, bedData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;

  } catch (error) {
    console.error("Error creating bed:", error);

    throw error.response?.data || {
      message: "Failed to create bed"
    };
  }
};


/* ---------------- DELETE BED (ADMIN) ---------------- */

export const deleteBed = async (bedId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.delete(`${API}/${bedId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;

  } catch (error) {
    console.error("Error deleting bed:", error);

    throw error.response?.data || {
      message: "Failed to delete bed"
    };
  }
};


/* ---------------- BED BOOKING CALENDAR ---------------- */

export const getBedCalendar = async (bedId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `http://localhost:5000/api/bookings/calendar/${bedId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return res.data;

  } catch (error) {
    console.error("Error fetching bed calendar:", error);

    throw error.response?.data || {
      message: "Failed to fetch bed calendar"
    };
  }
};