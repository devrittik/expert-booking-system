import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createBooking, updateBookingStatus } from "../services/bookingService";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["expert"] });
      queryClient.invalidateQueries({ queryKey: ["experts"] });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["expert"] });
      queryClient.invalidateQueries({ queryKey: ["experts"] });
    },
  });
}
