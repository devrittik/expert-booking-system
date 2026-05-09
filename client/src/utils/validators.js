import * as yup from "yup";

const phoneRegex = /^\+?[1-9]\d{6,14}$/;
const normalizePhone = (value) =>
  typeof value === "string" ? value.trim().replace(/[\s()-]/g, "") : value;

export const bookingSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Enter a valid email")
    .required("Email is required"),
  phone: yup
    .string()
    .transform((value) => normalizePhone(value))
    .matches(phoneRegex, "Enter a valid phone number")
    .required("Phone is required"),
  notes: yup
    .string()
    .transform((value) => (typeof value === "string" ? value.trim() : ""))
    .max(300, "Notes can be at most 300 characters")
    .default(""),
});
