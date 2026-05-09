import { Link } from "react-router-dom";

function SuccessModal({ booking, onClose }) {
  if (!booking) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="success-title">
        <p className="card-kicker">Booking created</p>
        <h2 id="success-title">Your session has been reserved.</h2>
        <p>
          {booking.name}, your booking for {booking.date} at {booking.timeSlot} is now{" "}
          <strong>{booking.status}</strong>.
        </p>
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            Close
          </button>
          <Link className="primary-button" to="/my-bookings">
            View my bookings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;
