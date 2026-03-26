import axios from "axios";

// const API = "http://localhost:5000/api/admin/dashboard/stats";
const API = import.meta.env.VITE_API_URL + "/admin/dashboard/stats";
export const getDashboardStats = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const res = await axios.get(API, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;

  } catch (error) {

    // Server responded with error status (400, 401, 500 etc.)
    if (error.response) {
      console.error("API Error:", error.response.data);

      throw new Error(
        error.response.data.message || "Failed to fetch dashboard stats"
      );
    }

    // Request made but no response received
    if (error.request) {
      console.error("Network Error:", error.request);
      throw new Error("Network error. Please check your connection.");
    }

    // Something else happened
    console.error("Unexpected Error:", error.message);
    throw new Error(error.message);
  }
};