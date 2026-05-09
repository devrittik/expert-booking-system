const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
    time: { type: String, required: true },        // e.g. "10:00 AM"
    isBooked: { type: Boolean, default: false },
});

const expertSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        experience: { type: Number, required: true },           // years
        rating: { type: Number, default: 0, min: 0, max: 5 },
        bio: { type: String, default: "" },
        avatar: { type: String, default: "" },
        slots: [
            {
                date: { type: String, required: true },        // "YYYY-MM-DD"
                timeSlots: [timeSlotSchema],
            },
        ],
    },
    { timestamps: true }
);

// Text index for name search
expertSchema.index({ name: "text" });

module.exports = mongoose.model("Expert", expertSchema);