import axios from "axios";

const API = "http://localhost:5000/api/users";

export const getAllUsers = async () => {
  try {

    const token = localStorage.getItem("token");

    const res = await axios.get(API, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;

  } catch (error) {

    console.error("Get Users Error:", error);

    throw error.response?.data || {
      message: "Failed to fetch users"
    };
  }
};


export const deleteUser = async (userId) => {
  try {

    const token = localStorage.getItem("token");

    const res = await axios.delete(`${API}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;

  } catch (error) {

    console.error("Delete User Error:", error);

    throw error.response?.data || {
      message: "Failed to delete user"
    };
  }
};