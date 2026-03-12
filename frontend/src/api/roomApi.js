import axios from "axios";

const API = "http://localhost:5000/api/rooms";

/**
 * GET ALL ROOMS
 */
export const getRooms = async () => {
  try {
    const res = await axios.get(API);
    return res.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);

    throw error.response?.data || {
      message: "Something went wrong while fetching rooms"
    };
  }
};


/**
 * CREATE ROOM (ADMIN)
 */
export const createRoom = async (data, token) => {
  try {
    const res = await axios.post(`${API}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;
  } catch (error) {
    console.error("Error creating room:", error);

    throw error.response?.data || {
      message: "Something went wrong while creating room"
    };
  }
};