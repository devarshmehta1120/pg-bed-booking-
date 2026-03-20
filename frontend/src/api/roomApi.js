import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "https://pg-bed-booking.onrender.com/api";

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


/* ---------------- GET ALL ROOMS ---------------- */
export const getRooms = async () => {
  try {
    const res = await axios.get(`${API}/rooms`);
    return res.data.data;

  } catch (error) {
    handleError(error, "Failed to fetch rooms");
  }
};


/* ---------------- CREATE ROOM ---------------- */
export const createRoom = async (formData) => {
  try {
    const res = await axios.post(
      `${API}/rooms`,
      formData,
      {
        ...getAuthConfig(),
        headers: {
          ...getAuthConfig().headers,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data.data;

  } catch (error) {
    handleError(error, "Failed to create room");
  }
};


/* ---------------- DELETE ROOM ---------------- */
export const deleteRoom = async (roomId) => {
  try {
    const res = await axios.delete(
      `${API}/rooms/${roomId}`,
      getAuthConfig()
    );

    return res.data.data;

  } catch (error) {
    handleError(error, "Failed to delete room");
  }
};


/* ---------------- SEARCH AVAILABLE ROOMS ---------------- */
export const searchAvailableRooms = async (startDate, endDate) => {
  try {
    const res = await axios.get(`${API}/rooms/available`, {
      params: { startDate, endDate },
    });

    return res.data.data;

  } catch (error) {
    handleError(error, "Failed to fetch available rooms");
  }
};