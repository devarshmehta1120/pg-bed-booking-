import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

import {
  getMyBookings,
  cancelBooking,
  refundBooking,
} from "../api/bookingApi";

const socket = io("http://localhost:5000");

function MyBookings() {
  const queryClient = useQueryClient();
  const [openMenu, setOpenMenu] = useState(null);
  const [tab, setTab] = useState("active");

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  refetchOnWindowFocus: true,   // ✅ refresh when user comes back
  refetchOnReconnect: true,     // ✅ refresh after internet reconnect
  staleTime: 0,                 // ✅ always fresh
  });

  /* ---------------- CANCEL ---------------- */
  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      toast.success("Booking cancelled");
      queryClient.invalidateQueries(["my-bookings"]);
    },
    onError: () => {
      toast.error("Cancel failed");
    },
  });

  /* ---------------- REFUND ---------------- */
  const refundMutation = useMutation({
    mutationFn: refundBooking,
    onSuccess: () => {
      toast.success("Refund processed");
      queryClient.invalidateQueries(["my-bookings"]);
    },
    onError: () => {
      toast.error("Refund failed");
    },
  });

  /* ---------------- SOCKET ---------------- */
  useEffect(() => {
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
  };

  socket.on("bookingUpdated", refresh);
  socket.on("bedBooked", refresh); // ✅ match backend emit

  return () => {
    socket.off("bookingUpdated", refresh);
    socket.off("bedBooked", refresh);
  };
}, [queryClient]);

  /* ---------------- HANDLERS ---------------- */
  const handleCancel = (id) => {
    const toastId = toast(
      ({ closeToast }) => (
        <div>
          <p>Cancel this booking?</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                cancelMutation.mutate(id);
                closeToast();
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  const handleRefund = (id) => {
    const toastId = toast(
      ({ closeToast }) => (
        <div>
          <p>Process refund?</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                refundMutation.mutate(id);
                closeToast();
              }}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  const downloadReceipt = async (id) => {
    const toastId = toast.loading("Downloading receipt...");

    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/receipt/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${id}.pdf`;
      a.click();

      toast.update(toastId, {
        render: "Receipt downloaded",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

    } catch (err) {
      toast.update(toastId, {
        render: "Download failed",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredBookings = bookings.filter((b) => {
    if (tab === "active") return b.bookingStatus === "confirmed";
    if (tab === "cancelled") return b.bookingStatus === "cancelled";
    if (tab === "completed") return b.bookingStatus === "completed";
  });

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        {["active", "cancelled", "completed"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full ${
              tab === t ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredBookings.map((b) => (
          <div
            key={b._id}
            className="relative bg-white p-5 rounded-2xl shadow-md border hover:shadow-xl transition"
          >

            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">
                Room {b.room?.roomNumber}
              </h2>

              <div onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === b._id ? null : b._id)
                  }
                >
                  <MoreVertical />
                </button>

                {openMenu === b._id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">

                    <button
                      onClick={() => downloadReceipt(b._id)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      📄 Receipt
                    </button>

                    {b.bookingStatus !== "cancelled" && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    )}

                    {b.bookingStatus === "cancelled" &&
                      b.paymentStatus === "paid" && (
                        <button
                          onClick={() => handleRefund(b._id)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          Refund
                        </button>
                      )}
                  </div>
                )}
              </div>
            </div>

            <p>Bed: {b.bed?.bedNumber}</p>

            {/* DATES WITH TIME */}
            <div className="text-sm text-gray-500">
              <p>
                Check-in:{" "}
                {new Date(b.startDate).toLocaleString("en-IN")}
              </p>
              <p>
                Check-out:{" "}
                {new Date(b.endDate).toLocaleString("en-IN")}
              </p>
            </div>

            <p className="text-lg font-bold text-blue-600">
              ₹{b.amount}
            </p>

            <p>Status: {b.bookingStatus}</p>
            <p>Payment: {b.paymentStatus}</p>

          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;