import { Link } from "@tanstack/react-router";
import {
  getAllRooms,
  searchAvailableRooms,
} from "../services/admin/roomService";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function Home() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const isFiltering = startDate && endDate;

  const {
    data: beds = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["availableBeds", startDate, endDate],
    queryFn: () => searchAvailableRooms(startDate, endDate),
    enabled: false,
  });
  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms"],
    queryFn: getAllRooms,
  });

  return (
    <div className="bg-gray-50">
      {/* HERO SECTION */}

      <section className="bg-[#2C4549] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight">
              Find Your Perfect PG Stay
            </h1>

            <p className="mt-6 text-lg text-gray-200">
              Comfortable rooms, affordable beds and instant booking. Choose
              your room and reserve your bed today.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/rooms"
                className="bg-white text-[#2C4549] px-6 py-3 rounded-lg font-semibold"
              >
                Browse Rooms
              </Link>

              <Link
                to="/register"
                className="border border-white px-6 py-3 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
            className="rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* {beds.map((bed)=>(
  <div key={bed._id}>
    {bed.bedNumber}
  </div>
))} */}

      {/* FEATURED ROOMS */}

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            {isFiltering ? "Available Beds" : "Rooms"}
          </h2>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mt-6 mb-4">
            <input
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C4549]"
            />

            <input
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C4549]"
            />

            <button
              onClick={refetch}
              className="bg-[#2C4549] hover:bg-[#22373a] text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Search
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {!isFiltering &&
              rooms.slice(0, 6).map((room) => (
                <div key={room._id} className="bg-white rounded-xl shadow">
                  <img
                    src={`http://localhost:5000${room.images?.[0]}`}
                    className="h-48 w-full object-cover rounded-t-xl"
                  />

                  <div className="p-5">
                    <h3 className="text-xl font-semibold">
                      Room {room.roomNumber}
                    </h3>

                    <p className="text-blue-600 font-bold mt-3">
                      ₹{room.pricePerBed} / Bed
                    </p>
                  </div>
                </div>
              ))}

            {isFiltering &&
              beds.map((bed) => (
                <div key={bed._id} className="bg-white rounded-xl shadow">
                  <img
                    src={`http://localhost:5000${bed.image}`}
                    className="h-48 w-full object-cover rounded-t-xl"
                  />

                  <div className="p-5">
                    <h3 className="text-xl font-semibold">{bed.bedNumber}</h3>

                    <p className="text-gray-500">Room {bed.room.roomNumber}</p>

                    <p className="text-blue-600 font-bold mt-3">
                      ₹{bed.room.pricePerBed}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* AMENITIES */}

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Amenities</h2>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl">📶</p>
              <h3 className="font-semibold mt-3">Free WiFi</h3>
            </div>

            <div>
              <p className="text-4xl">🚿</p>
              <h3 className="font-semibold mt-3">Clean Bathrooms</h3>
            </div>

            <div>
              <p className="text-4xl">🔐</p>
              <h3 className="font-semibold mt-3">24/7 Security</h3>
            </div>

            <div>
              <p className="text-4xl">⚡</p>
              <h3 className="font-semibold mt-3">Power Backup</h3>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING STEPS */}

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div>
              <p className="text-4xl">🏠</p>
              <h3 className="font-semibold mt-3">Choose Room</h3>
              <p className="text-gray-500">Browse available rooms and beds.</p>
            </div>

            <div>
              <p className="text-4xl">📅</p>
              <h3 className="font-semibold mt-3">Select Dates</h3>
              <p className="text-gray-500">Pick the dates for your stay.</p>
            </div>

            <div>
              <p className="text-4xl">💳</p>
              <h3 className="font-semibold mt-3">Secure Payment</h3>
              <p className="text-gray-500">Pay online and confirm booking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="bg-[#2C4549] text-white py-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold">PG Stay</h3>

            <p className="text-gray-300 mt-2">
              Comfortable PG accommodation with easy booking and secure payment.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>

            <ul className="space-y-1">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/rooms">Rooms</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Contact</h4>

            <p>Email: support@pgstay.com</p>
            <p>Phone: +91 9999999999</p>
          </div>
        </div>

        <p className="text-center text-gray-300 mt-8">
          © 2026 PG Stay. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
