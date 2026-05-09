const ApiError = require("../utils/ApiError");

function errorHandler(err, _req, res, _next) {
    let error = err;

    if (err.code === 11000) {
        error = new ApiError("This slot is already booked", 409);
    } else if (err.name === "CastError") {
        error = new ApiError("Invalid resource ID", 400);
    } else if (!(err instanceof ApiError)) {
        error = new ApiError(err.message || "Internal server error", err.statusCode || 500);
    }

    if (error.statusCode >= 500) {
        console.error(error);
    }

    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors || undefined,
    });
}

module.exports = errorHandler;
