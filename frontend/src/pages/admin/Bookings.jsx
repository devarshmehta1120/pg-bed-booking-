import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllBookings } from "../../services/admin/bookingService";

const Bookings = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const limit = 8;

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const res = await getAllBookings();
      return res.data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading bookings...</p>
      </div>
    );
  }

  const filtered = bookings.filter((b) =>
    b.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const statusFiltered =
    statusFilter === "all"
      ? filtered
      : filtered.filter((b) => b.bookingStatus === statusFilter);

  const totalPages = Math.ceil(statusFiltered.length / limit);
  const paginated = statusFiltered.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-4 sm:p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Bookings</h1>
        <p className="text-gray-500">Manage PG bookings</p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search user..."
          className="border px-4 py-2 rounded-lg w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded-lg w-full sm:w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="grid gap-4 sm:hidden">
        {paginated.length === 0 ? (
          <p className="text-center text-gray-400">No bookings found</p>
        ) : (
          paginated.map((b) => (
            <div key={b._id} className="bg-white p-4 rounded-xl shadow">

              <p className="font-semibold">{b.user?.name}</p>
              <p className="text-sm text-gray-500">{b.user?.phone}</p>

              <p className="mt-2 text-sm">
                Room {b.room?.roomNumber} | Bed {b.bed?.bedNumber}
              </p>

              <div className="flex gap-2 mt-2 flex-wrap">
                <span className={`px-2 py-1 text-xs rounded ${
                  b.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : b.paymentStatus === "refunded"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {b.paymentStatus}
                </span>

                <span className={`px-2 py-1 text-xs rounded ${
                  b.bookingStatus === "confirmed"
                    ? "bg-blue-100 text-blue-700"
                    : b.bookingStatus === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {b.bookingStatus}
                </span>
              </div>

              <div className="mt-2 text-xs text-gray-600">
                <p>
                  Check-in:{" "}
                  {new Date(b.startDate).toLocaleDateString()}
                </p>
                <p>
                  Check-out:{" "}
                  {new Date(b.endDate).toLocaleDateString()}
                </p>
              </div>

            </div>
          ))
        )}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden sm:block bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Phone</th>
              <th className="px-6 py-4 text-left">Room</th>
              <th className="px-6 py-4 text-left">Bed</th>
              <th className="px-6 py-4 text-left">Payment</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Dates</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-400">
                  No bookings found
                </td>
              </tr>
            ) : (
              paginated.map((b) => (
                <tr key={b._id} className="border-t hover:bg-gray-50">

                  <td className="px-6 py-4">{b.user?.name}</td>
                  <td className="px-6 py-4">{b.user?.phone}</td>
                  <td className="px-6 py-4">Room {b.room?.roomNumber}</td>
                  <td className="px-6 py-4">{b.bed?.bedNumber}</td>

                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      b.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : b.paymentStatus === "refunded"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {b.paymentStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      b.bookingStatus === "confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : b.bookingStatus === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {b.bookingStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <p>{new Date(b.startDate).toLocaleString()}</p>
                    <p>{new Date(b.endDate).toLocaleString()}</p>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-40 w-full sm:w-auto"
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded disabled:opacity-40 w-full sm:w-auto"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Bookings;