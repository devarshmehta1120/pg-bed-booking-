import { useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import EditBedModal from "../../components/admin/admincomponents/EditBedModal";
import AddBedModal from "../../components/admin/admincomponents/AddBedModal";

import { getBedsByRoom, deleteBed as deleteBedApi } from "../../api/bedApi";

function Beds() {
  const { roomId } = useParams({ strict: false });
  const queryClient = useQueryClient();

  const [showAdd, setShowAdd] = useState(false);
  const [editBed, setEditBed] = useState(null);

  const { data: beds = [], isLoading } = useQuery({
    queryKey: ["beds", roomId],
    queryFn: () => getBedsByRoom(roomId),
    enabled: !!roomId,
  });

  const deleteBed = async (id) => {
    if (!confirm("Delete this bed?")) return;

    await deleteBedApi(id);
    queryClient.invalidateQueries(["beds", roomId]);
  };

  if (isLoading) return <p className="p-6">Loading beds...</p>;

  return (
    <div className="p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">

        <h1 className="text-xl sm:text-2xl font-bold">Beds</h1>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          + Add Bed
        </button>

      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="grid gap-4 sm:hidden">
        {beds.map((bed) => (
          <div
            key={bed._id}
            className="bg-white rounded-lg shadow p-4"
          >
            {bed.image ? (
              <img
                src={`http://localhost:5000${bed.image}`}
                className="w-full h-40 object-cover rounded mb-3"
              />
            ) : (
              <div className="h-40 bg-gray-200 flex items-center justify-center rounded mb-3">
                No Image
              </div>
            )}

            <p className="font-semibold">Bed: {bed.bedNumber}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setEditBed(bed)}
                className="flex-1 bg-blue-500 text-white py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteBed(bed._id)}
                className="flex-1 bg-red-500 text-white py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border bg-white">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Bed Number</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {beds.map((bed) => (
              <tr key={bed._id} className="border-t">

                <td className="p-3">
                  {bed.image ? (
                    <img
                      src={`http://localhost:5000${bed.image}`}
                      className="w-20 h-14 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>

                <td className="p-3">{bed.bedNumber}</td>

                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditBed(bed)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteBed(bed._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* MODALS */}
      {showAdd && (
        <AddBedModal
          roomId={roomId}
          close={() => setShowAdd(false)}
        />
      )}

      {editBed && (
        <EditBedModal
          bed={editBed}
          close={() => setEditBed(null)}
        />
      )}

    </div>
  );
}

export default Beds;