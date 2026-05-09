import api from "./api";

export async function createBooking(payload) {
  const response = await api.post("/bookings", payload);
  return response.data;
}

export async function getBookingsByEmail(email) {
  const response = await api.get("/bookings", { params: { email } });
  return response.data;
}

export async function getAllBookings() {
  const response = await api.get("/bookings");
  return response.data;
}

export async function updateBookingStatus(id, status) {
  const response = await api.patch(`/bookings/${id}/status`, { status });
  return response.data;
}
