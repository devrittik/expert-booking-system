import { useEffect } from "react";

import { useSocketContext } from "../context/useSocketContext.js";

export function useSocket(expertId, { onSlotBooked, onSlotReleased }) {
  const socket = useSocketContext();

  useEffect(() => {
    if (!socket || !expertId) {
      return undefined;
    }

    const handleSlotBooked = ({ expertId: incomingExpertId, date, timeSlot }) => {
      if (incomingExpertId === expertId) {
        onSlotBooked(date, timeSlot);
      }
    };

    const handleSlotReleased = ({ expertId: incomingExpertId, date, timeSlot }) => {
      if (incomingExpertId === expertId && onSlotReleased) {
        onSlotReleased(date, timeSlot);
      }
    };

    socket.emit("expert:watch", expertId);
    socket.on("slot:booked", handleSlotBooked);
    socket.on("slot:released", handleSlotReleased);

    return () => {
      socket.emit("expert:leave", expertId);
      socket.off("slot:booked", handleSlotBooked);
      socket.off("slot:released", handleSlotReleased);
    };
  }, [socket, expertId, onSlotBooked, onSlotReleased]);
}
