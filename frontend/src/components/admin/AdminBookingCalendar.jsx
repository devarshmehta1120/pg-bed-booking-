import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { socket } from "../../instance/soceket";

function AdminBookingCalendar() {
  const token = localStorage.getItem("token");

  const { data: bookings = [], refetch } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:5000/api/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.data;
    },
  });

  const events = bookings.map((booking) => ({
    title: `R${booking.room?.roomNumber} - B${booking.bed?.bedNumber}`,
    start: booking.startDate,
    end: booking.endDate,
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
    textColor: "white",
  }));

  useEffect(() => {
    socket.on("bedBooked", () => {
      refetch();
    });

    return () => {
      socket.off("bedBooked");
    };
  }, [refetch]);

  return (
    <div className="bg-white p-3 sm:p-6 rounded-lg shadow">

      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
        Booking Calendar
      </h2>

      {/* SCROLL FIX FOR MOBILE */}
      <div className="overflow-x-auto">

        <div className="min-w-[600px] sm:min-w-full">

          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}

            height="auto"

            /* MOBILE FRIENDLY HEADER */
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "today",
            }}

            /* MAKE TEXT SMALL ON MOBILE */
            dayMaxEventRows={2}

          />

        </div>
      </div>

    </div>
  );
}

export default AdminBookingCalendar;