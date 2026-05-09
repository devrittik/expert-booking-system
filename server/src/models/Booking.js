const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        expert: { type: mongoose.Schema.Types.ObjectId, ref: "Expert", required: true },
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true },
        date: { type: String, required: true },            // "YYYY-MM-DD"
        timeSlot: { type: String, required: true },            // "10:00 AM"
        notes: { type: String, default: "" },
        status: {
            type: String,
            enum: ["pending", "confirmed", "completed", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// CRITICAL — prevents double booking at DB level (race condition safe)
bookingSchema.index(
    { expert: 1, date: 1, timeSlot: 1 },
    { unique: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
