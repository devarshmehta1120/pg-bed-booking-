import { useParams, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function BookBed() {

  const { bedId } = useParams({ strict:false });
  const { roomId } = useSearch({ strict:false });

  const [startDate,setStartDate] = useState(null);
  const [endDate,setEndDate] = useState(null);

  /* ================= GET BED DETAILS ================= */

  const { data: bed, isLoading } = useQuery({
    queryKey:["bed",bedId],
    queryFn:async()=>{

      const res = await axios.get(
        `http://localhost:5000/api/beds/${bedId}`
      )

      return res.data.data
    },
    enabled:!!bedId
  })

  const pricePerBed = bed?.room?.pricePerBed || 0

  /* ================= GET BOOKED DATES ================= */

  const { data: bookedDates = [] } = useQuery({
    queryKey:["calendar",bedId],
    queryFn:async()=>{

      const res = await axios.get(
        `http://localhost:5000/api/bookings/calendar/${bedId}`
      )

      return res.data.data.map((b)=>({
        start:new Date(b.startDate),
        end:new Date(b.endDate)
      }))
    },
    enabled:!!bedId
  })

  /* ================= PRICE CALCULATION ================= */

  const calculateDays = () => {

    if(!startDate || !endDate) return 0

    return Math.ceil(
      (endDate-startDate)/(1000*60*60*24)
    ) + 1
  }

  const totalPrice = calculateDays() * pricePerBed

  /* ================= RAZORPAY PAYMENT ================= */

  const openRazorpay = (order,bookingId)=>{

    const options = {

      key: import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount: order.amount,
      currency: order.currency,
      order_id: order.id,

      name:"PG Bed Booking",
      description:"Bed Reservation",

      handler: async function(response){

        const token = localStorage.getItem("token")

        await axios.post(
          "http://localhost:5000/api/bookings/verify-payment",
          {
            bookingId,
            razorpay_order_id:response.razorpay_order_id,
            razorpay_payment_id:response.razorpay_payment_id,
            razorpay_signature:response.razorpay_signature
          },
          {
            headers:{
              Authorization:`Bearer ${token}`
            }
          }
        )

        alert("Payment Successful & Booking Confirmed")

      },

      theme:{
        color:"#2563eb"
      }

    }

    const razor = new window.Razorpay(options)
    razor.open()

  }

  /* ================= CREATE BOOKING ================= */

  const handleBooking = async()=>{

    try{

      if(!roomId || !bedId){
        alert("Room or Bed missing")
        return
      }

      if(!startDate || !endDate){
        alert("Select booking dates")
        return
      }

      if(totalPrice <= 0){
        alert("Invalid booking price")
        return
      }

      const token = localStorage.getItem("token")

      const formatDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

      const res = await axios.post(
        "http://localhost:5000/api/bookings/create",
        {
          room:roomId,
          bed:bedId,
          startDate:formatDate(startDate),
          endDate:formatDate(endDate),
          amount:totalPrice
        },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      const { bookingId, order } = res.data

      openRazorpay(order,bookingId)

    }catch(error){

      console.error(error)
      alert(error.response?.data?.message || "Booking failed")

    }

  }

  if(isLoading){
    return <p className="p-6">Loading bed details...</p>
  }

return (

<div className="bg-gray-50 min-h-screen py-10">

  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6">

    {/* LEFT SIDE - BED DETAILS */}

    <div className="bg-white rounded-xl shadow overflow-hidden">

      <img
        src={`http://localhost:5000${bed?.image}`}
        className="w-full h-72 object-cover"
      />

      <div className="p-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Room {bed?.room?.roomNumber}
        </h1>

        <p className="text-gray-500 mt-1">
          Bed {bed?.bedNumber}
        </p>

        <p className="text-blue-600 text-xl font-semibold mt-3">
          ₹{pricePerBed} / Day
        </p>

        <p className="text-gray-600 mt-4">
          Comfortable PG bed with clean environment,
          WiFi, electricity and security included.
        </p>

      </div>

    </div>


    {/* RIGHT SIDE - BOOKING CARD */}

    <div className="bg-white rounded-xl shadow p-6 h-fit sticky top-10">

      <h2 className="text-xl font-semibold mb-6">
        Book this Bed
      </h2>

      {/* START DATE */}

      <div className="mb-4">

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>

        <DatePicker
          selected={startDate}
          onChange={(date)=>setStartDate(date)}
          excludeDateIntervals={bookedDates}
          minDate={new Date()}
          className="border w-full p-3 rounded-md"
        />

      </div>


      {/* END DATE */}

      <div className="mb-4">

        <label className="block text-sm font-medium text-gray-700 mb-1">
          End Date
        </label>

        <DatePicker
          selected={endDate}
          onChange={(date)=>setEndDate(date)}
          excludeDateIntervals={bookedDates}
          minDate={startDate || new Date()}
          className="border w-full p-3 rounded-md"
        />

      </div>


      {/* BOOKING SUMMARY */}

      <div className="bg-gray-50 rounded-lg p-4 mb-6">

        <h3 className="font-semibold mb-2">
          Booking Summary
        </h3>

        <div className="flex justify-between text-sm text-gray-600">

          <span>Price / Day</span>
          <span>₹{pricePerBed}</span>

        </div>

        <div className="flex justify-between text-sm text-gray-600 mt-1">

          <span>Days</span>
          <span>{calculateDays()}</span>

        </div>

        <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-lg">

          <span>Total</span>
          <span className="text-blue-600">₹{totalPrice}</span>

        </div>

      </div>


      {/* PAY BUTTON */}

      <button
        onClick={handleBooking}
        disabled={!startDate || !endDate}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
      >
        Pay & Book
      </button>

    </div>

  </div>

</div>

)

}

export default BookBed