import { FaBed, FaUsers, FaShieldAlt, FaMapMarkerAlt } from "react-icons/fa";
import Gallery from "../components/common/gallery";

function AboutUs() {
  return (
    <div className="bg-white min-h-screen">

      {/* HERO */}
      <div className="bg-[#2C4549] text-white py-16 text-center px-4">
        <h1 className="text-4xl font-bold mb-4">
          About PG Bed Booking
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-200">
          Making PG accommodation simple, affordable, and reliable in Ahmedabad.
        </p>
      </div>

      

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">

        {/* WHO WE ARE */}
        <div className="bg-white border p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 text-[#2C4549]">
            <FaUsers /> Who We Are
          </h2>
          <p className="text-gray-600">
            PG Bed Booking is a smart platform designed for students and
            working professionals in Ahmedabad to easily find and book PG beds.
            We eliminate the hassle of visiting multiple locations by providing
            everything online in one place.
          </p>
        </div>

        {/* MISSION + VISION */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border p-8 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-[#2C4549]">
              <FaShieldAlt /> Our Mission
            </h2>
            <p className="text-gray-600">
              To provide a transparent and secure platform where users can
              book PG beds with confidence and ease.
            </p>
          </div>

          <div className="bg-white border p-8 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-[#2C4549]">
              <FaMapMarkerAlt /> Our Vision
            </h2>
            <p className="text-gray-600">
              To become the most trusted PG booking platform across India.
            </p>
          </div>
        </div>
        

        {/* WHAT WE OFFER */}
        <div className="bg-white border p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-[#2C4549]">
            <FaBed /> What We Offer
          </h2>

          <div className="grid md:grid-cols-2 gap-4 text-gray-600">
            <p>✔ Easy online PG bed booking</p>
            <p>✔ Real-time availability tracking</p>
            <p>✔ Secure payment integration</p>
            <p>✔ Verified PG listings</p>
            <p>✔ User-friendly interface</p>
            <p>✔ Quick booking confirmation</p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white border p-6 rounded-xl shadow">
            <h3 className="text-3xl font-bold text-[#2C4549]">100+</h3>
            <p className="text-gray-500">Rooms Listed</p>
          </div>

          <div className="bg-white border p-6 rounded-xl shadow">
            <h3 className="text-3xl font-bold text-[#2C4549]">500+</h3>
            <p className="text-gray-500">Bookings Done</p>
          </div>

          <div className="bg-white border p-6 rounded-xl shadow">
            <h3 className="text-3xl font-bold text-[#2C4549]">200+</h3>
            <p className="text-gray-500">Happy Users</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#2C4549] text-white text-center p-10 rounded-2xl">
          <h2 className="text-2xl font-bold mb-3">
            Find Your Perfect PG Today
          </h2>
          <p className="mb-5 text-gray-200">
            Book your bed in Ahmedabad with just a few clicks.
          </p>

          <a
            href="/rooms"
            className="bg-white text-[#2C4549] px-6 py-3 rounded-lg font-semibold"
          >
            Browse Rooms
          </a>
        </div>

      </div>
    </div>
  );
}

export default AboutUs;