import { useQuery } from "@tanstack/react-query";

import { getBookingsByEmail } from "../services/bookingService";

export function useMyBookings(email) {
  return useQuery({
    queryKey: ["bookings", email],
    queryFn: () => getBookingsByEmail(email),
    enabled: Boolean(email),
  });
}
