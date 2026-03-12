import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getBedsByRoom } from "../../services/admin/bedService";

function Beds() {

  const { roomId } = useParams({ strict: false });

  const { data: beds = [], isLoading } = useQuery({
    queryKey: ["beds", roomId],
    queryFn: () => getBedsByRoom(roomId),
    enabled: !!roomId,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 text-lg">Loading beds...</p>
      </div>
    );

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Beds in this Room
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {beds.map((bed) => (
  <div
  key={bed._id}
  className="bg-white shadow-md rounded-xl overflow-hidden text-center border"
>

  {bed.image ? (
  <img
    src={`http://localhost:5000${bed.image}`}
    alt="bed"
    className="w-full h-40 object-cover"
  />
) : (
  <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
    No Image
  </div>
)}

  <div className="p-6">

    <h2 className="text-xl font-semibold text-gray-700 mb-2">
      {bed.bedNumber}
    </h2>

    <span
      className={`px-3 py-1 text-sm rounded-full ${
        bed.isAvailable
          ? "bg-green-100 text-green-600"
          : "bg-red-100 text-red-600"
      }`}
    >
      {bed.isAvailable ? "Available" : "Booked"}
    </span>

  </div>

</div>
))}

      </div>
    </div>
  );
}

export default Beds;