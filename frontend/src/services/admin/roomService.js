import axios from "axios";

// const API = "http://localhost:5000/api/rooms";

const API = import.meta.env.VITE_API_URL + "/rooms";

export const getAllRooms = async () => {
  try {
    const res = await axios.get(API);
    return res.data.data;

  } catch (error) {
    console.error("Get Rooms Error:", error);

    throw error.response?.data || {
      message: "Failed to fetch rooms"
    };
  }
};

export const createRoom = async (formData) => {
  try {

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const res = await axios.post(API, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    return res.data;

  } catch (error) {

    console.error("Create Room Error:", error);

    // Backend error
    if (error.response) {
      throw error.response.data || {
        message: "Failed to create room"
      };
    }

    // Network error
    if (error.request) {
      throw {
        message: "Network error. Please check your connection."
      };
    }

    // Unknown error
    throw {
      message: error.message || "Something went wrong"
    };
  }
};


export const deleteRoom = async (roomId) => {
  try {

    const token = localStorage.getItem("token");

    const res = await axios.delete(`${API}/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;

  } catch (error) {
    console.error("Delete Room Error:", error);

    throw error.response?.data || {
      message: "Failed to delete room"
    };
  }
};

export const searchAvailableRooms = async (startDate, endDate) => {
  try {

    const res = await axios.get(
      `${API}/available`,
      {
        params: { startDate, endDate }
      }
    );

    return res.data.data;

  } catch (error) {
    console.error(error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch available rooms"
    );
  }
};