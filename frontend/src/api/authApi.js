import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://pg-bed-booking.onrender.com/api";

const AUTH_API = `${BASE_URL}/auth`;
const USER_API = `${BASE_URL}/users`;

/* ---------------- ERROR HANDLER ---------------- */
const handleError = (error, defaultMessage) => {
  if (error.response) {
    return error.response.data || { message: defaultMessage };
  } else if (error.request) {
    return { message: "No response from server. Please try again later." };
  } else {
    return { message: error.message || defaultMessage };
  }
};

/* ---------------- REGISTER ---------------- */
export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${AUTH_API}/register`, userData);
    return res.data;
  } catch (error) {
    console.error("Register Error:", error);
    throw handleError(error, "Registration failed");
  }
};

/* ---------------- LOGIN ---------------- */
export const loginUser = async (userData) => {
  try {
    const res = await axios.post(`${AUTH_API}/login`, userData);

    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return res.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw handleError(error, "Login failed");
  }
};

/* ---------------- GET PROFILE ---------------- */
export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${USER_API}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    throw handleError(error, "Failed to fetch profile");
  }
};

/* ---------------- LOGOUT ---------------- */
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};