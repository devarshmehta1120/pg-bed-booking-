import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import axios from "axios"

function Rooms() {

  const navigate = useNavigate()

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/api/rooms")
      return res.data.data
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading Rooms...
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="bg-white shadow-sm">

        <div className="max-w-6xl mx-auto px-6 py-8">

          <h1 className="text-4xl font-bold text-gray-800">
            Available Rooms
          </h1>

          <p className="text-gray-500 mt-2">
            Choose a room and book your bed instantly
          </p>

        </div>

      </div>

      {/* ROOMS GRID */}

      <div className="max-w-6xl mx-auto p-6">

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {rooms.map((room) => (

            <div
              key={room._id}
              onClick={() =>
                navigate({
                  to: "/rooms/$roomId",
                  params: { roomId: room._id }
                })
              }
              className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition duration-300 cursor-pointer"
            >

              {/* IMAGE */}

              <div className="relative">

                <img
                  src={`http://localhost:5000${room.images[0]}`}
                  className="h-52 w-full object-cover group-hover:scale-105 transition duration-300"
                />

                {/* BED BADGE */}

                <div className="absolute top-3 left-3 bg-white px-3 py-1 text-sm rounded-full shadow">
                  {room.totalBeds} Beds
                </div>

              </div>

              {/* CONTENT */}

              <div className="p-5">

                <h2 className="text-xl font-semibold text-gray-800">
                  Room {room.roomNumber}
                </h2>

                <p className="text-gray-500 mt-1">
                  Comfortable PG Accommodation
                </p>

                <div className="flex justify-between items-center mt-4">

                  <span className="text-2xl font-bold text-blue-600">
                    ₹{room.pricePerBed}
                  </span>

                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                    View Beds
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default Rooms