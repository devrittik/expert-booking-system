const Booking = require("../models/Booking");
const Expert = require("../models/Expert");
const ApiError = require("../utils/ApiError");

exports.createBooking = async (req, res, next) => {
    try {
        const { expert, date, timeSlot, name, email, phone, notes } = req.body;

        const expertExists = await Expert.exists({ _id: expert });
        if (!expertExists) {
            throw new ApiError("Expert not found", 404);
        }

        const booking = await Booking.create({
            expert,
            date,
            timeSlot,
            name,
            email,
            phone,
            notes,
        });

        const slotUpdate = await Expert.updateOne(
            { _id: expert, "slots.date": date, "slots.timeSlots.time": timeSlot },
            { $set: { "slots.$[d].timeSlots.$[t].isBooked": true } },
            { arrayFilters: [{ "d.date": date }, { "t.time": timeSlot }] }
        );

        if (!slotUpdate.matchedCount) {
            await Booking.findByIdAndDelete(booking._id);
            throw new ApiError("Selected slot is not available for this expert", 400);
        }

        const payload = { expertId: expert.toString(), date, timeSlot };
        const io = req.app.get("io");
        io.emit("slot:booked", payload);

        res.status(201).json({ success: true, data: booking });
    } catch (err) {
        next(err);
    }
};

exports.getBookingsByEmail = async (req, res, next) => {
    try {
        const { email } = req.query;

        const query = email ? { email: email.toLowerCase() } : {};

        const bookings = await Booking.find(query)
            .populate("expert", "name category avatar")
            .sort({ createdAt: -1 })
            .lean();

        res.json({ success: true, data: bookings });
    } catch (err) {
        next(err);
    }
};

exports.updateBookingStatus = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            throw new ApiError("Booking not found", 404);
        }

        const previousStatus = booking.status;
        booking.status = req.body.status;
        await booking.save();

        if (previousStatus !== "cancelled" && booking.status === "cancelled") {
            await Expert.updateOne(
                { _id: booking.expert, "slots.date": booking.date, "slots.timeSlots.time": booking.timeSlot },
                { $set: { "slots.$[d].timeSlots.$[t].isBooked": false } },
                { arrayFilters: [{ "d.date": booking.date }, { "t.time": booking.timeSlot }] }
            );
        }

        if (previousStatus === "cancelled" && booking.status !== "cancelled") {
            await Expert.updateOne(
                { _id: booking.expert, "slots.date": booking.date, "slots.timeSlots.time": booking.timeSlot },
                { $set: { "slots.$[d].timeSlots.$[t].isBooked": true } },
                { arrayFilters: [{ "d.date": booking.date }, { "t.time": booking.timeSlot }] }
            );
        }

        const io = req.app.get("io");
        const payload = {
            bookingId: booking._id.toString(),
            expertId: booking.expert.toString(),
            date: booking.date,
            timeSlot: booking.timeSlot,
            status: booking.status,
            previousStatus,
        };

        io.emit("booking:statusChanged", payload);

        if (previousStatus !== "cancelled" && booking.status === "cancelled") {
            io.emit("slot:released", {
                expertId: booking.expert.toString(),
                date: booking.date,
                timeSlot: booking.timeSlot,
            });
        }

        if (previousStatus === "cancelled" && booking.status !== "cancelled") {
            io.emit("slot:booked", {
                expertId: booking.expert.toString(),
                date: booking.date,
                timeSlot: booking.timeSlot,
            });
        }

        res.json({ success: true, data: booking });
    } catch (err) {
        next(err);
    }
};
