import { useState } from "react";
import { startTransition } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ErrorState from "../components/common/ErrorState.jsx";
import Loader from "../components/common/Loader.jsx";
import SlotGrid from "../components/slots/SlotGrid.jsx";
import { useExpert } from "../hooks/useExperts.js";
import { useSocket } from "../hooks/useSocket.js";

const normalizeSlotGroups = (slotGroups) => {
  const groupedSlots = new Map();

  slotGroups.forEach((slotGroup) => {
    const existingGroup = groupedSlots.get(slotGroup.date);

    if (!existingGroup) {
      groupedSlots.set(slotGroup.date, {
        ...slotGroup,
        timeSlots: [...slotGroup.timeSlots],
      });
      return;
    }

    const seenTimes = new Set(existingGroup.timeSlots.map((slot) => slot.time));

    slotGroup.timeSlots.forEach((slot) => {
      if (!seenTimes.has(slot.time)) {
        existingGroup.timeSlots.push(slot);
        seenTimes.add(slot.time);
      }
    });
  });

  return Array.from(groupedSlots.values());
};

function ExpertDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useExpert(id);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const expert = data?.data;
  const [localSlots, setLocalSlots] = useState(null);
  const slots = normalizeSlotGroups(localSlots || expert?.slots || []);

  useSocket(id, {
    onSlotBooked: (date, timeSlot) => {
      startTransition(() => {
        setLocalSlots((currentSlots) => {
          const source = normalizeSlotGroups(currentSlots || expert?.slots || []);
          return source.map((slotGroup) => {
            if (slotGroup.date !== date) {
              return slotGroup;
            }

            return {
              ...slotGroup,
              timeSlots: slotGroup.timeSlots.map((slot) =>
                slot.time === timeSlot ? { ...slot, isBooked: true } : slot
              ),
            };
          });
        });

        setSelectedSlot((current) =>
          current?.date === date && current?.timeSlot === timeSlot ? null : current
        );
      });
    },
    onSlotReleased: (date, timeSlot) => {
      startTransition(() => {
        setLocalSlots((currentSlots) => {
          const source = normalizeSlotGroups(currentSlots || expert?.slots || []);
          return source.map((slotGroup) => {
            if (slotGroup.date !== date) {
              return slotGroup;
            }

            return {
              ...slotGroup,
              timeSlots: slotGroup.timeSlots.map((slot) =>
                slot.time === timeSlot ? { ...slot, isBooked: false } : slot
              ),
            };
          });
        });
      });
    },
  });

  if (isLoading) {
    return <Loader label="Loading expert details..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.response?.data?.message || "We could not load this expert."}
        actionLabel="Try again"
        onAction={refetch}
      />
    );
  }

  return (
    <section className="page detail-layout">
      <div className="detail-card">
        <p className="card-kicker">{expert.category}</p>
        <h2>{expert.name}</h2>
        <p className="expert-meta">
          {expert.experience} years experience - Rating {expert.rating?.toFixed(1) || "0.0"}
        </p>
        <p className="detail-copy">
          {expert.bio || "This expert has not added a profile summary yet."}
        </p>
      </div>

      <div className="detail-card">
        <div className="section-heading">
          <h2>Available time slots</h2>
          <p>Live updates will disable slots as soon as another user books them.</p>
        </div>

        <SlotGrid slots={slots} selectedSlot={selectedSlot} onSelect={setSelectedSlot} />

        <div className="cta-row">
          <button
            type="button"
            className="primary-button"
            disabled={!selectedSlot}
            onClick={() =>
              navigate("/book", {
                state: {
                  expert,
                  selectedSlot,
                },
              })
            }
          >
            Book now
          </button>
        </div>
      </div>
    </section>
  );
}

export default ExpertDetailPage;
