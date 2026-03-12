    import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"

function Navbar() {

  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("user"))

  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [search, setSearch] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()

    navigate({
      to: "/rooms",
      search: { q: search }
    })
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate({ to: "/login" })
  }

  return (
    <nav className="bg-[#2C4549] text-white shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

        {/* LOGO */}

        <Link to="/" className="text-xl font-bold tracking-wide">
          PG Stay
        </Link>


        {/* SEARCH BAR */}

        <form
          onSubmit={handleSearch}
          className="hidden md:flex bg-white rounded-lg overflow-hidden"
        >

          <input
            type="text"
            placeholder="Search rooms..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="px-4 py-1 text-black outline-none"
          />

          <button className="bg-[#1f3235] px-4">
            🔍
          </button>

        </form>


        {/* NAV LINKS */}

        <div className="hidden md:flex items-center gap-8">

          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>

          <Link to="/rooms" className="hover:text-gray-300">
            Rooms
          </Link>

          {user && (
            <Link to="/my-bookings" className="hover:text-gray-300">
              My Bookings
            </Link>
          )}

        </div>


        {/* USER SECTION */}

        <div className="flex items-center gap-4">

          {!user ? (

            <>
              <Link
                to="/login"
                className="border border-white px-4 py-1 rounded-lg hover:bg-white hover:text-[#2C4549]"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-white text-[#2C4549] px-4 py-1 rounded-lg hover:bg-gray-200"
              >
                Register
              </Link>
            </>

          ) : (

            <div className="relative">

              <button
                onClick={()=>setProfileOpen(!profileOpen)}
                className="flex items-center gap-2"
              >

                {/* USER AVATAR */}

                <div className="w-8 h-8 bg-white text-[#2C4549] rounded-full flex items-center justify-center font-bold">
                  {user.name?.charAt(0)}
                </div>

                <span className="hidden md:block">
                  {user.name}
                </span>

              </button>


              {/* DROPDOWN */}

              {profileOpen && (

                <div className="absolute right-0 mt-3 bg-white text-black rounded-lg shadow w-40">

                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/my-bookings"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Bookings
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

        </div>


        {/* MOBILE MENU BUTTON */}

        <button
          onClick={()=>setMenuOpen(!menuOpen)}
          className="md:hidden"
        >
          ☰
        </button>

      </div>


      {/* MOBILE MENU */}

      {menuOpen && (

        <div className="md:hidden px-6 pb-4 space-y-3">

          <Link to="/" className="block">
            Home
          </Link>

          <Link to="/rooms" className="block">
            Rooms
          </Link>

          {user && (
            <Link to="/my-bookings" className="block">
              My Bookings
            </Link>
          )}

        </div>

      )}

    </nav>
  )
}

export default Navbar