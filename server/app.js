const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const expertRoutes = require("./src/routes/expertRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const errorHandler = require("./src/middlewares/errorHandler");
const ApiError = require("./src/utils/ApiError");

const app = express();

app.use(morgan("dev"));
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        status: 200,
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/experts", expertRoutes);
app.use("/api/bookings", bookingRoutes);

app.use((_req, _res, next) => {
    next(new ApiError("Route not found", 404));
});

app.use(errorHandler);

module.exports = app;