import axios from "axios";

const API = "http://localhost:5000/api/auth";


/* ---------------- REGISTER USER ---------------- */

export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API}/register`, userData);

    return res.data;

  } catch (error) {
    console.error("Register Error:", error);
    throw error.response?.data || { message: "Registration failed" };
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
    throw error.response?.data || { message: "Login failed" };
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
    throw error.response?.data || { message: "Failed to fetch profile" };
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