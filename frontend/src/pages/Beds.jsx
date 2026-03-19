import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { getBedsByRoom } from "../api/bedApi"; // ✅ use API layer
import { socket } from "../instance/soceket";

function Beds() {
  const { roomId } = useParams({ strict: false });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* ---------------- FETCH BEDS ---------------- */
  const { data: beds = [], isLoading } = useQuery({
    queryKey: ["beds", roomId],
    queryFn: () => getBedsByRoom(roomId), // ✅ no axios here
    enabled: !!roomId, // ✅ safe fetch
  });

  /* ---------------- SOCKET UPDATE ---------------- */
  useEffect(() => {
    socket.on("bedBooked", (data) => {
      queryClient.setQueryData(["beds", roomId], (oldBeds = []) =>
        oldBeds.map((bed) =>
          bed._id === data.bedId
            ? { ...bed, isAvailable: false }
            : bed
        )
      );
    });

    return () => socket.off("bedBooked");
  }, [roomId, queryClient]);

  /* ---------------- LOADING ---------------- */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading Beds...
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Available Beds
          </h1>
          <p className="text-gray-500 mt-1">
            Select a bed to view booking details
          </p>
        </div>
      </div>

      {/* BED GRID */}
      <div className="max-w-6xl mx-auto p-6">
        {beds.length === 0 ? (
          <p className="text-gray-500">No beds available</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {beds.map((bed) => (
              <div
                key={bed._id}
                onClick={() =>
                  navigate({
                    to: "/beds/$bedId",
                    params: { bedId: bed._id },
                    search: { roomId: roomId },
                  })
                }
                className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition duration-300 cursor-pointer"
              >

                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={`http://localhost:5000${bed.image}`}
                    className="h-32 w-full object-cover group-hover:scale-105 transition duration-300"
                  />

                  {/* STATUS BADGE */}
                  {/* {!bed.isAvailable && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Booked
                    </span>
                  )} */}
                </div>

                {/* INFO */}
                <div className="p-4">
                  <h2 className="font-semibold text-lg text-gray-800">
                    Bed {bed.bedNumber}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Tap to view booking
                  </p>
                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

export default Beds;