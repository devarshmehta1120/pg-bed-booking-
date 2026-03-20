import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "https://pg-bed-booking.onrender.com/api";

/* ---------------- AXIOS INSTANCE ---------------- */
const axiosInstance = axios.create({
  baseURL: API,
});

/* ---------------- AUTH HELPER ---------------- */
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

/* ---------------- ERROR HANDLER ---------------- */
const handleError = (error, defaultMessage) => {
  console.error("API Error:", error?.response || error.message);

  return (
    error.response?.data || {
      message: defaultMessage,
    }
  );
};

/* ================= USER PROFILE ================= */

/* GET PROFILE */
export const getProfile = async () => {
  try {
    const res = await axiosInstance.get("/users/profile", getAuthConfig());
    return res.data.data;
  } catch (error) {
    throw handleError(error, "Failed to fetch profile");
  }
};

/* UPDATE PROFILE */
export const updateProfile = async (data) => {
  try {
    const res = await axiosInstance.put("/users/profile", data, getAuthConfig());
    return res.data;
  } catch (error) {
    throw handleError(error, "Failed to update profile");
  }
};

/* CHANGE PASSWORD */
export const changePasswordApi = async (passwords) => {
  try {
    const res = await axiosInstance.put(
      "/users/change-password",
      passwords,
      getAuthConfig()
    );
    return res.data;
  } catch (error) {
    throw handleError(error, "Failed to change password");
  }
};

/* UPLOAD AVATAR */
export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axiosInstance.post("/users/upload-avatar", formData, {
      ...getAuthConfig(),
      headers: {
        ...getAuthConfig().headers,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    throw handleError(error, "Failed to upload avatar");
  }
};

/* ================= ADMIN USERS ================= */

/* GET ALL USERS */
export const getAllUsers = async () => {
  try {
    const res = await axiosInstance.get("/users", getAuthConfig());
    return res.data.data;
  } catch (error) {
    throw handleError(error, "Failed to fetch users");
  }
};

/* DELETE USER */
export const deleteUser = async (userId) => {
  try {
    const res = await axiosInstance.delete(
      `/users/${userId}`,
      getAuthConfig()
    );
    return res.data.data;
  } catch (error) {
    throw handleError(error, "Failed to delete user");
  }
};
export const requestPasswordChange = async () => {
  try {
    const res = await axiosInstance.post(
      "/users/request-password-change",
      {},
      getAuthConfig()
    );
    return res.data;
  } catch (error) {
    throw handleError(error, "Failed to send verification code");
  }
};

/* VERIFY OTP + CHANGE PASSWORD */
export const verifyPasswordChange = async (data) => {
  try {
    const res = await axiosInstance.post(
      "/users/verify-password-change",
      data,
      getAuthConfig()
    );
    return res.data;
  } catch (error) {
    throw handleError(error, "Failed to verify code and change password");
  }
};