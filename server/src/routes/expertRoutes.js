const express = require("express");
const { param } = require("express-validator");

const { getExperts, getExpertById } = require("../controllers/expertController");
const validate = require("../middlewares/validate");

const router = express.Router();

router.get("/", getExperts);
router.get("/:id", validate([param("id").isMongoId().withMessage("Valid expert ID required")]), getExpertById);

module.exports = router;
