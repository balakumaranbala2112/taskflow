import AppError from "../utils/AppError.js";
import { sendError } from "../utils/apiResponse.js";

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let error = err;

  // Handle Zod validation errors
  if (err.name === "ZodError") {
    const message = err.issues.map((issue) => issue.message).join(", ");

    error = new AppError(message, 400);

    error.validationErrors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  }

  // Handle invalid MongoDB ObjectId
  if (err.name === "CastError") {
    error = new AppError("Invalid resource ID", 400);
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");

    error = new AppError(message, 400);
  }

  // Handle duplicate MongoDB values
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];

    error = new AppError(`${field || "Field"} already exists`, 409);
  }

  // Handle invalid JWT
  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token", 401);
  }

  // Handle expired JWT
  if (err.name === "TokenExpiredError") {
    error = new AppError("Token expired", 401);
  }

  // Determine HTTP status
  const statusCode = error.statusCode || 500;

  // Log errors for developers
  if (statusCode >= 500) {
    console.error("SERVER ERROR:", err);
  }

  const response = {
    success: false,
    status: error.status || "error",
    message:
      statusCode >= 500 && !error.isOperational
        ? "Internal Server Error"
        : error.message,
  };

  if (error.validationErrors) {
    response.errors = error.validationErrors;
  }

  // Send consistent response
  res.status(statusCode).json(response);
};

export default errorHandler;
