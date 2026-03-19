import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

function AddBedModal({ roomId, close }) {

  const [bedNumber, setBedNumber] = useState("");
  const [image, setImage] = useState(null);

  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("bedNumber", bedNumber);
  formData.append("room", roomId);

  if (image) {
    formData.append("image", image);
  }

  await axios.post(
    "http://localhost:5000/api/beds/create",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  queryClient.invalidateQueries(["beds", roomId]);

  close();
};

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded w-96"
      >

        <h2 className="text-xl font-bold mb-4">Add Bed</h2>

        <input
          placeholder="Bed Number"
          value={bedNumber}
          onChange={(e) => setBedNumber(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-3"
        />

        <div className="flex justify-end gap-2">

          <button
            type="button"
            onClick={close}
            className="px-3 py-1 border"
          >
            Cancel
          </button>

          <button className="bg-green-600 text-white px-3 py-1">
            Add
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddBedModal;