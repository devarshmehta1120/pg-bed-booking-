import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  getAllRooms,
  createRoom,
  deleteRoom
} from "../../services/admin/roomService";

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

  /* HANDLE BED COUNT */
  const handleBedsChange = (e) => {
    const beds = Number(e.target.value);

    setForm({
      ...form,
      totalBeds: beds,
      bedImages: new Array(beds).fill(null)
    });
  };

  /* ================= GET ROOMS ================= */

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: getAllRooms
  });

  /* ================= CREATE ROOM ================= */

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries(["rooms"]);
      setShowModal(false);
    }
  });

  /* ================= DELETE ROOM ================= */

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

    /* ROOM IMAGES */
    for (let i = 0; i < form.images.length; i++) {
      formData.append("images", form.images[i]);
    }

    /* BED IMAGES */
    for (let i = 0; i < form.bedImages.length; i++) {
      if (form.bedImages[i]) {
        formData.append("bedImages", form.bedImages[i]);
      }
    }

    createRoomMutation.mutate(formData);
  };

  if (isLoading) return <p>Loading rooms...</p>;

  return (
    <div className="p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Rooms
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
        >
          + Add Room
        </button>

      </div>

      {/* ROOM CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {rooms.map((room) => (

          <div
            key={room._id}
            className="bg-white border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >

            {room.images?.length > 0 && (
              <img
                src={`http://localhost:5000${room.images[0]}`}
                alt="room"
                className="w-full h-40 object-cover"
              />
            )}

            <div className="p-6">

              <h2 className="text-xl font-semibold mb-2">
                Room {room.roomNumber}
              </h2>

              <p className="text-gray-600">
                Beds: {room.totalBeds}
              </p>

              <p className="text-gray-600 mb-4">
                Price: ₹{room.pricePerBed}
              </p>

              <div className="flex gap-2">

                <button
                  onClick={() =>
                    navigate({
                      to: "/admin/beds/$roomId",
                      params: { roomId: room._id }
                    })
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Beds
                </button>

                <button
                  onClick={() => deleteRoomMutation.mutate(room._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* ADD ROOM MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-[400px]">

            <h2 className="text-xl font-semibold mb-4">
              Create Room
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Room Number"
                className="border w-full p-2 rounded"
                onChange={(e) =>
                  setForm({ ...form, roomNumber: e.target.value })
                }
              />

              {/* TOTAL BEDS INPUT */}

              <input
                type="number"
                placeholder="Total Beds"
                className="border w-full p-2 rounded"
                onChange={handleBedsChange}
              />

              {/* BED IMAGE INPUTS */}

              {form.totalBeds > 0 && (
                <div className="space-y-2">

                  <p className="font-semibold">Bed Images</p>

                  {Array.from({ length: form.totalBeds }).map((_, index) => (

                    <div key={index} className="flex items-center gap-2">

                      <label className="w-20">
                        Bed {index + 1}
                      </label>

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

              {/* ROOM IMAGES */}

              <input
                type="file"
                multiple
                accept="image/*"
                className="border w-full p-2 rounded"
                onChange={(e) =>
                  setForm({ ...form, images: e.target.files })
                }
              />

              <div className="flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
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
}
export default Rooms;