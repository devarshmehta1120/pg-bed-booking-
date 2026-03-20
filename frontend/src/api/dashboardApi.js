import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}`;

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


/* ---------------- GET DASHBOARD STATS ---------------- */
export const getDashboardStats = async () => {
  try {
    const res = await axios.get(
      `${API}/admin/dashboard/stats`,
      getAuthConfig()
    );

    return res.data;

  } catch (error) {
    handleError(error, "Failed to fetch dashboard stats");
  }
};