const express = require("express");
const { body, param, query } = require("express-validator");

const {
    createBooking,
    getBookingsByEmail,
    updateBookingStatus,
} = require("../controllers/bookingController");
const validate = require("../middlewares/validate");

const router = express.Router();
const phoneRegex = /^\+?[1-9]\d{6,14}$/;
const normalizePhone = (value) =>
    typeof value === "string" ? value.trim().replace(/[\s()-]/g, "") : value;

router.post(
    "/",
    validate([
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Name is required")
            .bail()
            .isLength({ min: 3 })
            .withMessage("Name must be at least 3 characters"),
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .bail()
            .normalizeEmail()
            .isEmail()
            .withMessage("Valid email required"),
        body("phone")
            .trim()
            .notEmpty()
            .withMessage("Phone is required")
            .bail()
            .customSanitizer(normalizePhone)
            .matches(phoneRegex)
            .withMessage("Valid phone number required"),
        body("date").notEmpty().withMessage("Date is required"),
        body("timeSlot").notEmpty().withMessage("Time slot is required"),
        body("expert").isMongoId().withMessage("Valid expert ID required"),
        body("notes")
            .optional({ values: "falsy" })
            .trim()
            .isLength({ max: 300 })
            .withMessage("Notes can be at most 300 characters"),
    ]),
    createBooking
);

router.get(
    "/",
    validate([query("email").optional().isEmail().withMessage("Valid email query is required")]),
    getBookingsByEmail
);

router.patch(
    "/:id/status",
    validate([
        param("id").isMongoId().withMessage("Valid booking ID required"),
        body("status")
            .isIn(["pending", "confirmed", "completed", "cancelled"])
            .withMessage("Valid status required"),
    ]),
    updateBookingStatus
);

module.exports = router;
