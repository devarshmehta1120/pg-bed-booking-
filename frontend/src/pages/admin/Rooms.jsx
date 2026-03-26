import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { createRoom, deleteRoom, getRooms } from "../../api/roomApi";


/* ✅ ADD THIS */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getImageUrl = (img) => {
  if (!img) return "";

  if (img.startsWith("http")) {
    return img; // Cloudinary
  }

  return `${BASE_URL}${img}`; // Local
};

const Rooms = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    roomNumber: "",
    totalBeds: "",
    pricePerBed: "",
    images: [],
    bedImages: []
  });

  const handleBedsChange = (e) => {
    const beds = Number(e.target.value);

    setForm({
      ...form,
      totalBeds: beds,
      bedImages: new Array(beds).fill(null)
    });
  };

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries(["rooms"]);
      setShowModal(false);
    }
  });

  const deleteRoomMutation = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries(["rooms"]);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("roomNumber", form.roomNumber);
    formData.append("totalBeds", form.totalBeds);
    formData.append("pricePerBed", form.pricePerBed);

    for (let i = 0; i < form.images.length; i++) {
      formData.append("images", form.images[i]);
    }

    for (let i = 0; i < form.bedImages.length; i++) {
      if (form.bedImages[i]) {
        formData.append("bedImages", form.bedImages[i]);
      }
    }

    createRoomMutation.mutate(formData);
  };

  if (isLoading) return <p className="p-4">Loading rooms...</p>;

  return (
    <div className="p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Rooms</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          + Add Room
        </button>
      </div>

      {/* ROOM CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            {room.images?.length > 0 && (
              <img
                src={getImageUrl(room.images[0])}
                className="w-full h-40 sm:h-44 object-cover"
              />
            )}

            <div className="p-4 sm:p-5">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">
                Room {room.roomNumber}
              </h2>

              <p className="text-gray-600 text-sm">
                Beds: {room.totalBeds}
              </p>

              <p className="text-gray-600 mb-3 text-sm">
                ₹{room.pricePerBed}
              </p>

              <div className="flex flex-col sm:flex-row gap-2">

                <button
                  onClick={() =>
                    navigate({
                      to: "/admin/beds/$roomId",
                      params: { roomId: room._id }
                    })
                  }
                  className="bg-blue-500 text-white px-3 py-2 rounded w-full sm:w-auto"
                >
                  Beds
                </button>

                <button
                  onClick={() => deleteRoomMutation.mutate(room._id)}
                  className="bg-red-500 text-white px-3 py-2 rounded w-full sm:w-auto"
                >
                  Delete
                </button>

              </div>
            </div>
          </div>
        ))}

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 z-50">

          <div className="bg-white p-5 sm:p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-semibold mb-4">Create Room</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Room Number"
                className="border w-full p-2 rounded"
                onChange={(e) =>
                  setForm({ ...form, roomNumber: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Total Beds"
                className="border w-full p-2 rounded"
                onChange={handleBedsChange}
              />

              {form.totalBeds > 0 && (
                <div className="space-y-2">
                  <p className="font-semibold">Bed Images</p>

                  {Array.from({ length: form.totalBeds }).map((_, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-2">
                      <label className="sm:w-24">Bed {index + 1}</label>

                      <input
                        type="file"
                        accept="image/*"
                        className="border p-1 rounded w-full"
                        onChange={(e) => {
                          const newBedImages = [...form.bedImages];
                          newBedImages[index] = e.target.files[0];

                          setForm({
                            ...form,
                            bedImages: newBedImages
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              <input
                type="number"
                placeholder="Price Per Bed"
                className="border w-full p-2 rounded"
                onChange={(e) =>
                  setForm({ ...form, pricePerBed: e.target.value })
                }
              />

              <input
                type="file"
                multiple
                accept="image/*"
                className="border w-full p-2 rounded"
                onChange={(e) =>
                  setForm({ ...form, images: e.target.files })
                }
              />

              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border px-4 py-2 rounded w-full sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto"
                >
                  Create
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Rooms;