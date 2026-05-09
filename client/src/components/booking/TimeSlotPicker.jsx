function TimeSlotPicker({ selectedSlot, onBack }) {
  return (
    <div className="aside-card">
      <p className="card-kicker">Booking details</p>
      <h3>{selectedSlot ? `${selectedSlot.date}` : "Choose an available slot"}</h3>
      <p>{selectedSlot ? selectedSlot.timeSlot : "Go back and select a time from the expert page."}</p>
      <button type="button" className="secondary-button" onClick={onBack}>
        Back to expert
      </button>
    </div>
  );
}

export default TimeSlotPicker;
