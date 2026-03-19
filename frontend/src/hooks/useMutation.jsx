import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useRefundBooking = (token) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => refundBookingApi(id, token),

    onSuccess: () => {
      // Refresh bookings list
      queryClient.invalidateQueries(["my-bookings"]);
    },

    onError: (error) => {
      console.error("Refund failed:", error.response?.data?.message);
    },
  });
};