import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { Link, useNavigate } from "@tanstack/react-router";
import {
  getAllRooms,
  searchAvailableRooms,
} from "../services/admin/roomService";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Gallery from "../components/common/gallery";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

/* ✅ ADD THIS HELPER */
const getImageUrl = (img) => {
  if (!img) return "";

  if (img.startsWith("http")) {
    return img; // Cloudinary
  }

  return `${BASE_URL}${img}`; // Local
};

function Home() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const isFiltering = startDate && endDate;
  const navigate = useNavigate();
console.log("ENV API:", import.meta.env.VITE_API_URL);
console.log("ENV BASE:", import.meta.env.VITE_BASE_URL);
  /* SEARCH */
  const {
    data: beds = [],
    isLoading: searchLoading,
    isError: searchError,
    refetch,
  } = useQuery({
    queryKey: ["availableBeds", startDate, endDate],
    queryFn: () => searchAvailableRooms(startDate, endDate),
    enabled: !!startDate && !!endDate,
    // enabled: false,
  });

  /* ROOMS */
  const {
    data: rooms = [],
    isLoading: roomsLoading,
    isError: roomsError,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: getAllRooms,
  });

  useEffect(() => {
    if (searchError) toast.error("Failed to fetch available beds");
  }, [searchError]);

  useEffect(() => {
    if (roomsError) toast.error("Failed to load rooms");
  }, [roomsError]);

  const handleSearch = () => {
    if (!startDate || !endDate) {
      return toast.error("Please select both dates");
    }
    refetch();
  };

  return (
    <div className="bg-gray-50">

      {/* HERO SECTION */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          loop
          className="h-full"
        >
          {[
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
          ].map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={img}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>

        <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
          <div className="text-center text-white max-w-2xl">

            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Find Your Perfect PG Stay
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-200">
              Comfortable rooms, affordable beds and instant booking.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link
                to="/rooms"
                className="bg-white text-[#2C4549] px-5 py-2.5 rounded-lg font-semibold"
              >
                Browse Rooms
              </Link>

              <Link
                to="/register"
                className="border border-white px-5 py-2.5 rounded-lg"
              >
                Get Started
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ROOMS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-12">
            {isFiltering ? "Available Beds" : "Rooms"}
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <input
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-4 py-2 rounded-lg w-full sm:w-auto"
            />
            <input
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-4 py-2 rounded-lg w-full sm:w-auto"
            />
            <button
              onClick={handleSearch}
              className="bg-[#2C4549] text-white px-6 py-2 rounded-lg w-full sm:w-auto"
            >
              Search
            </button>
          </div>

          {(roomsLoading || searchLoading) && (
            <p className="text-center">Loading...</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {!isFiltering &&
              rooms.slice(0, 6).map((room) => (
                <div
                  key={room._id}
                  onClick={() =>
                    navigate({
                      to: "/rooms/$roomId",
                      params: { roomId: room._id },
                    })
                  }
                  className="bg-white rounded-xl shadow cursor-pointer hover:shadow-lg hover:scale-105 transition overflow-hidden"
                >
                  <img
                    src={getImageUrl(room.images?.[0])}
                    className="h-44 sm:h-48 w-full object-cover"
                  />
                  <div className="p-4 sm:p-5">
                    <h3 className="font-semibold text-lg">
                      Room {room.roomNumber}
                    </h3>
                    <p className="text-blue-600 font-medium mt-1">
                      ₹{room.pricePerBed}
                    </p>
                  </div>
                </div>
              ))}

            {isFiltering &&
              beds.map((bed) => (
                <div
                  key={bed._id}
                  onClick={() =>
                    navigate({
                      to: "/beds/$bedId",
                      params: { bedId: bed._id },
                    })
                  }
                  className="bg-white rounded-xl shadow cursor-pointer hover:shadow-lg hover:scale-105 transition overflow-hidden"
                >
                  <img
                    src={getImageUrl(bed.image)}
                    className="h-44 sm:h-48 w-full object-cover"
                  />
                  <div className="p-4 sm:p-5">
                    <h3 className="font-semibold">{bed.bedNumber}</h3>
                    <p className="text-sm text-gray-500">
                      Room {bed.room.roomNumber}
                    </p>
                    <p className="text-blue-600 font-medium">
                      ₹{bed.room.pricePerBed}
                    </p>
                  </div>
                </div>
              ))}

          </div>
        </div>
      </section>

      <Gallery />

      {/* (rest unchanged) */}
    </div>
  );
}

export default Home;