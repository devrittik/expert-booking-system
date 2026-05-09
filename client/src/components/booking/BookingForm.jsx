function BookingForm({ register, errors, isSubmitting, onSubmit, selectedSlot }) {
  return (
    <form className="booking-form" onSubmit={onSubmit}>
      <div className="booking-summary">
        <p className="card-kicker">Selected slot</p>
        <h2>{selectedSlot ? `${selectedSlot.date} at ${selectedSlot.timeSlot}` : "No slot selected"}</h2>
      </div>

      <label className="form-field">
        <span className="field-label">Full name</span>
        <input type="text" {...register("name")} />
        {errors.name ? <small className="field-error">{errors.name.message}</small> : null}
      </label>

      <label className="form-field">
        <span className="field-label">Email</span>
        <input type="email" {...register("email")} />
        {errors.email ? <small className="field-error">{errors.email.message}</small> : null}
      </label>

      <label className="form-field">
        <span className="field-label">Phone</span>
        <input type="tel" {...register("phone")} />
        {errors.phone ? <small className="field-error">{errors.phone.message}</small> : null}
      </label>

      <label className="form-field">
        <span className="field-label">Notes</span>
        <textarea rows="4" {...register("notes")} />
        {errors.notes ? <small className="field-error">{errors.notes.message}</small> : null}
      </label>

      <button type="submit" className="primary-button" disabled={isSubmitting || !selectedSlot}>
        {isSubmitting ? "Booking..." : "Confirm booking"}
      </button>
    </form>
  );
}

export default BookingForm;
