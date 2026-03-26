import { Link } from "@tanstack/react-router";

function Footer() {
  return (
    <footer className="bg-[#2C4549] text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* LOGO / ABOUT */}
        <div>
          <h2 className="text-xl font-bold mb-3">PG Stay</h2>
          <p className="text-gray-300 text-sm">
            Find comfortable and affordable PG stays with ease. Book your
            perfect room anytime, anywhere.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <div className="flex flex-col gap-2 text-gray-300 text-sm">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/rooms" className="hover:text-white">Rooms</Link>
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>

        {/* USER */}
        <div>
          <h3 className="font-semibold mb-3">Account</h3>
          <div className="flex flex-col gap-2 text-gray-300 text-sm">
            <Link to="/login" className="hover:text-white">Login</Link>
            <Link to="/register" className="hover:text-white">Register</Link>
            <Link to="/mybooking" className="hover:text-white">My Bookings</Link>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="text-gray-300 text-sm">Ahmedabad, India</p>
          <p className="text-gray-300 text-sm">+91 98765 43210</p>
          <p className="text-gray-300 text-sm">support@pgstay.com</p>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-600 text-center py-4 text-gray-300 text-sm">
        © {new Date().getFullYear()} PG Stay. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;