import axios from "axios";

const API = "http://localhost:5000/api/beds";

// export const updateBedImage = async (bedId, file) => {

//   const token = localStorage.getItem("token");

//   const formData = new FormData();
//   formData.append("image", file);

//   const res = await axios.put(
//     `${API}/${bedId}/image`,
//     formData,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   return res.data.data;
// };

export const getBedsByRoom = async (roomId) => {
  try {

    const res = await axios.get(`${API}/room/${roomId}`);

    return res.data.data;

  } catch (error) {

    console.error("Get Beds Error:", error);

    throw error.response?.data || {
      message: "Failed to fetch beds"
    };
  }
};


export const createBed = async (bedData) => {
  try {

    const token = localStorage.getItem("token");

    const res = await axios.post(`${API}/create`, bedData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data;

  } catch (error) {

    console.error("Create Bed Error:", error);

    throw error.response?.data || {
      message: "Failed to create bed"
    };
  }
};


export const deleteBed = async (bedId) => {
  try {

    const token = localStorage.getItem("token");

    const res = await axios.delete(`${API}/${bedId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data.data;

  } catch (error) {

    console.error("Delete Bed Error:", error);

    throw error.response?.data || {
      message: "Failed to delete bed"
    };
  }
};

