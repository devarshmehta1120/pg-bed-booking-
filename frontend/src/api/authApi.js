import axios from "axios";

const API = "http://localhost:5000/api/auth";

/* ---------------- HELPER: ERROR HANDLER ---------------- */

const handleError = (error, defaultMessage) => {
  if (error.response) {
    // Server responded with a status code
    return error.response.data || { message: defaultMessage };
  } else if (error.request) {
    // Request made but no response (server down / network issue)
    return { message: "No response from server. Please try again later." };
  } else {
    // Something else happened
    return { message: error.message || defaultMessage };
  }
};


/* ---------------- REGISTER USER ---------------- */

export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API}/register`, userData);
    return res.data;

  } catch (error) {
    console.error("Register Error:", error);
    throw handleError(error, "Registration failed");
  }
};


/* ---------------- LOGIN USER ---------------- */

export const loginUser = async (userData) => {
  try {
    const res = await axios.post(`${API}/login`, userData);

    const { token, user } = res.data;

    // Save to localStorage
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

    const res = await axios.get(`${API}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;

  } catch (error) {
    console.error("Profile Fetch Error:", error);
    throw handleError(error, "Failed to fetch profile");
  }
};


/* ---------------- LOGOUT ---------------- */

export const logoutUser = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Logout Error:", error);
  }
};