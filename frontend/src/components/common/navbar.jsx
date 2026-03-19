import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "../../api/userApi";

function Navbar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const isAdmin = user?.role === "admin";

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    queryClient.clear();
    navigate({ to: "/login" });
  };

  return (
    <nav className="bg-[#2C4549] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-lg sm:text-xl font-bold">
          PG Stay
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/rooms" className="hover:text-gray-300">Rooms</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
          <Link to="/contact" className="hover:text-gray-300">Contact</Link>

          {user && <Link to="/mybooking">My Bookings</Link>}
          {isAdmin && <Link to="/admin">Admin</Link>}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* AUTH BUTTONS */}
          {!user ? (
            <div className="hidden sm:flex gap-2">
              <Link
                to="/login"
                className="border border-white px-3 py-1 rounded-lg hover:bg-white hover:text-[#2C4549]"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-white text-[#2C4549] px-3 py-1 rounded-lg hover:bg-gray-200"
              >
                Register
              </Link>
            </div>
          ) : (
            /* PROFILE */
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white">
                  {user?.avatar ? (
                    <img
                      src={`http://localhost:5000/${user.avatar.replace(/\\/g, "/")}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#2C4549] font-bold">
                      {user?.name?.charAt(0)}
                    </div>
                  )}
                </div>

                <span className="hidden md:block text-sm">
                  {user?.name}
                </span>
              </button>

              {/* DROPDOWN */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 bg-white text-black rounded-lg shadow w-44 overflow-hidden">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-[#2C4549] px-4 pb-4 space-y-3 border-t border-gray-600">

          <Link to="/" onClick={() => setMenuOpen(false)} className="block">
            Home
          </Link>

          <Link to="/rooms" onClick={() => setMenuOpen(false)} className="block">
            Rooms
          </Link>

          <Link to="/about" onClick={() => setMenuOpen(false)} className="block">
            About
          </Link>

          <Link to="/contact" onClick={() => setMenuOpen(false)} className="block">
            Contact
          </Link>

          {user && (
            <Link to="/mybooking" onClick={() => setMenuOpen(false)} className="block">
              My Bookings
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="block">
              Admin
            </Link>
          )}

          {!user && (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                className="border border-white px-4 py-2 rounded-lg text-center"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-white text-[#2C4549] px-4 py-2 rounded-lg text-center"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;