import React, { useEffect, useState } from "react";
import { getAllBookings } from "../../services/admin/bookingService";

const Bookings = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(res.data || []);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Bookings
        </h1>
        <p className="text-gray-500">
          Manage all PG bed bookings
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden border">

        <table className="w-full text-left">

          {/* Table Header */}
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Room</th>
              <th className="px-6 py-4">Bed</th>
              <th className="px-6 py-4">Start Date</th>
              <th className="px-6 py-4">End Date</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y">

            {bookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-400">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr
                  key={b._id}
                  className="hover:bg-gray-50 transition"
                >

                  <td className="px-6 py-4 font-medium text-gray-700">
                    {b.user?.name || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    Room {b.room?.roomNumber}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {b.bed?.bedNumber}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {new Date(b.startDate).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {new Date(b.endDate).toLocaleDateString()}
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Bookings;