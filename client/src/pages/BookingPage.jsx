import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import BookingForm from "../components/booking/BookingForm.jsx";
import SuccessModal from "../components/booking/SuccessModal.jsx";
import TimeSlotPicker from "../components/booking/TimeSlotPicker.jsx";
import ErrorState from "../components/common/ErrorState.jsx";
import { useCreateBooking } from "../hooks/useBooking.js";
import { bookingSchema } from "../utils/validators.js";

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [createdBooking, setCreatedBooking] = useState(null);
  const { expert, selectedSlot } = location.state || {};
  const mutation = useCreateBooking();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  if (!expert || !selectedSlot) {
    return (
      <ErrorState
        message="Booking details are missing. Please choose an expert and slot first."
        actionLabel="Browse experts"
        onAction={() => navigate("/experts")}
      />
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await mutation.mutateAsync({
        ...values,
        expert: expert._id,
        date: selectedSlot.date,
        timeSlot: selectedSlot.timeSlot,
      });

      setCreatedBooking(response.data);
      reset();
    } catch (error) {
      return error;
    }
  });

  const conflictMessage =
    mutation.error?.response?.status === 409
      ? "Slot just got booked. Please go back and choose another one."
      : mutation.error?.response?.data?.message;

  return (
    <section className="page booking-layout">
      <div className="detail-card">
        <p className="card-kicker">Phase 3 - Booking flow</p>
        <h1>Reserve your session with {expert.name}</h1>
        <p className="detail-copy">
          Your chosen date and time are pre-filled from the expert page so you can finish booking fast.
        </p>

        {conflictMessage ? (
          <div className="inline-alert" role="alert">
            {conflictMessage}
          </div>
        ) : null}

        <BookingForm
          register={register}
          errors={errors}
          isSubmitting={mutation.isPending}
          onSubmit={onSubmit}
          selectedSlot={selectedSlot}
        />
      </div>

      <TimeSlotPicker
        selectedSlot={selectedSlot}
        onBack={() => navigate(`/experts/${expert._id}`)}
      />

      <SuccessModal booking={createdBooking} onClose={() => setCreatedBooking(null)} />
    </section>
  );
}

export default BookingPage;
