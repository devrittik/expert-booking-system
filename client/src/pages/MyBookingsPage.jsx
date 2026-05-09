import { useState } from "react";

import Badge from "../components/common/Badge.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import Loader from "../components/common/Loader.jsx";
import { STATUS_LABELS } from "../constants/index.js";
import { useMyBookings } from "../hooks/useMyBookings.js";
import { getStatusTone } from "../utils/formatters.js";

function MyBookingsPage() {
  const [emailInput, setEmailInput] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { data, isLoading, isError, error, refetch } = useMyBookings(submittedEmail);

  const bookings = data?.data || [];

  return (
    <section className="page">
      <div className="hero-panel hero-panel-compact">
        <p className="eyebrow">Booking lookup</p>
        <h1>Find every booking tied to your email address.</h1>
      </div>

      <form
        className="lookup-form"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmittedEmail(emailInput.trim());
        }}
      >
        <label className="search-field search-field-wide">
          <span className="field-label">Email address</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={emailInput}
            onChange={(event) => setEmailInput(event.target.value)}
          />
        </label>
        <button type="submit" className="primary-button">
          Search bookings
        </button>
      </form>

      {isLoading ? <Loader label="Loading bookings..." /> : null}
      {isError ? (
        <ErrorState
          message={error?.response?.data?.message || "We could not fetch your bookings."}
          actionLabel="Try again"
          onAction={refetch}
        />
      ) : null}

      {!isLoading && !isError && submittedEmail ? (
        bookings.length ? (
          <div className="booking-list">
            {bookings.map((booking) => (
              <article key={booking._id} className="booking-card">
                <div className="section-heading">
                  <div>
                    <p className="card-kicker">{booking.expert?.category || "Expert session"}</p>
                    <h2>{booking.expert?.name || "Expert unavailable"}</h2>
                  </div>
                  <Badge tone={getStatusTone(booking.status)}>
                    {STATUS_LABELS[booking.status] || booking.status}
                  </Badge>
                </div>
                <p>{booking.date} at {booking.timeSlot}</p>
                <p>Booked for {booking.name}</p>
                <p>{booking.email}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="feedback-card">
            <p>No bookings were found for {submittedEmail}.</p>
          </div>
        )
      ) : null}
    </section>
  );
}

export default MyBookingsPage;
