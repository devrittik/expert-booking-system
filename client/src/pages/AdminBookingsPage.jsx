import { useQuery } from "@tanstack/react-query";

import Badge from "../components/common/Badge.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import Loader from "../components/common/Loader.jsx";
import { STATUS_LABELS } from "../constants/index.js";
import { useUpdateBookingStatus } from "../hooks/useBooking.js";
import { getAllBookings } from "../services/bookingService.js";
import { getStatusTone } from "../utils/formatters.js";

function AdminBookingsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["bookings", "admin"],
    queryFn: getAllBookings,
  });
  const updateStatus = useUpdateBookingStatus();
  const bookings = data?.data || [];

  return (
    <section className="page">
      <div className="hero-panel hero-panel-compact">
        <p className="eyebrow">Demo Admin Panel</p>
        <h1>Review bookings and update their current status.</h1>
      </div>

      {isLoading ? <Loader label="Loading all bookings..." /> : null}
      {isError ? (
        <ErrorState
          message={error?.response?.data?.message || "We could not fetch bookings."}
          actionLabel="Try again"
          onAction={refetch}
        />
      ) : null}

      {!isLoading && !isError ? (
        bookings.length ? (
          <div className="booking-list">
            {bookings.map((booking) => (
              <article key={booking._id} className="booking-card">
                <div className="section-heading">
                  <div>
                    <p className="card-kicker">Demo Admin View</p>
                    <h2>{booking.name}</h2>
                  </div>
                  <Badge tone={getStatusTone(booking.status)}>
                    {STATUS_LABELS[booking.status] || booking.status}
                  </Badge>
                </div>

                <p>Expert: {booking.expert?.name || "Expert unavailable"}</p>
                <p>
                  Session: {booking.date} at {booking.timeSlot}
                </p>
                <p>Email: {booking.email}</p>
                <p>Phone: {booking.phone}</p>

                <label className="search-field">
                  <span className="field-label">Update status</span>
                  <select
                    value={booking.status}
                    onChange={(event) =>
                      updateStatus.mutate({
                        id: booking._id,
                        status: event.target.value,
                      })
                    }
                    disabled={updateStatus.isPending}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>
              </article>
            ))}
          </div>
        ) : (
          <div className="feedback-card">
            <p>No bookings have been created yet.</p>
          </div>
        )
      ) : null}
    </section>
  );
}

export default AdminBookingsPage;
