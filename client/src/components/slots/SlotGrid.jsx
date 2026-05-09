import { formatDateLabel } from "../../utils/formatters.js";

function SlotGrid({ slots = [], selectedSlot, onSelect }) {
  if (!slots.length) {
    return (
      <div className="feedback-card">
        <p>No availability has been published for this expert yet.</p>
      </div>
    );
  }

  return (
    <div className="slot-groups">
      {slots.map((slotGroup) => (
        <section key={slotGroup.date} className="slot-group">
          <div className="slot-group-heading">
            <h3>{formatDateLabel(slotGroup.date)}</h3>
            <p>{slotGroup.date}</p>
          </div>
          <div className="slot-grid">
            {slotGroup.timeSlots.map((slot) => {
              const isSelected =
                selectedSlot?.date === slotGroup.date && selectedSlot?.timeSlot === slot.time;

              return (
                <button
                  key={`${slotGroup.date}-${slot.time}`}
                  type="button"
                  className={`slot-button${isSelected ? " is-selected" : ""}`}
                  disabled={slot.isBooked}
                  onClick={() => onSelect({ date: slotGroup.date, timeSlot: slot.time })}
                >
                  <span>{slot.time}</span>
                  <small>{slot.isBooked ? "Booked" : "Available"}</small>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export default SlotGrid;
