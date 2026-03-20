import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "https://pg-bed-booking.onrender.com/api";

/* ---------------- HELPER: GET TOKEN ---------------- */
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* ---------------- HELPER: ERROR HANDLER ---------------- */
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


/* ---------------- GET BEDS BY ROOM ---------------- */
export const getBedsByRoom = async (roomId) => {
  try {
    const res = await axios.get(`${API}/beds/room/${roomId}`);
    return res.data.data;

  } catch (error) {
    handleError(error, "Failed to fetch beds");
  }
};


/* ---------------- CREATE BED (ADMIN) ---------------- */
export const createBed = async (bedData) => {
  try {
    const res = await axios.post(
      `${API}/beds/create`,
      bedData,
      getAuthConfig()
    );

    return res.data.data;

  } catch (error) {
    handleError(error, "Failed to create bed");
  }
};


/* ---------------- DELETE BED (ADMIN) ---------------- */
export const deleteBed = async (bedId) => {
  try {
    const res = await axios.delete(
      `${API}/beds/${bedId}`,
      getAuthConfig()
    );

    return res.data.data;

  } catch (error) {
    handleError(error, "Failed to delete bed");
  }
};


/* ---------------- BED BOOKING CALENDAR ---------------- */
export const getBedCalendar = async (bedId) => {
  try {
    const res = await axios.get(
      `${API}/bookings/calendar/${bedId}`,
      getAuthConfig()
    );

    return res.data.data;

  } catch (error) {
    handleError(error, "Failed to fetch bed calendar");
  }
};


/* ---------------- GET BED BY ID ---------------- */
export const getBedById = async (bedId) => {
  try {
    const res = await axios.get(`${API}/beds/${bedId}`);
    return res.data.data;

  } catch (error) {
    handleError(error, "Failed to fetch bed");
  }
};
/* ---------------- UPDATE BED IMAGE (OPTIONAL) ---------------- */
// Uncomment if needed

// export const updateBedImage = async (bedId, file) => {
//   try {
//     const formData = new FormData();
//     formData.append("image", file);

//     const res = await axios.put(
//       `${API}/beds/${bedId}/image`,
//       formData,
//       {
//         ...getAuthConfig(),
//         headers: {
//           ...getAuthConfig().headers,
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     return res.data.data;

//   } catch (error) {
//     console.error("Update Image Error:", error);

//     throw error.response?.data || {
//       message: "Failed to update bed image",
//     };
//   }
// };
