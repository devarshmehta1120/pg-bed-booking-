import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

function EditBedModal({ bed, close }) {

  const [bedNumber, setBedNumber] = useState(bed.bedNumber);
  const [image, setImage] = useState(null);

  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("bedNumber", bedNumber);

    if (image) {
      formData.append("image", image);
    }

    await axios.put(
      `http://localhost:5000/api/beds/${bed._id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    queryClient.invalidateQueries(["beds"]);

    close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded w-96"
      >

        <h2 className="text-xl font-bold mb-4">Edit Bed</h2>

        <input
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

          <button className="bg-blue-600 text-white px-3 py-1">
            Update
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditBedModal;