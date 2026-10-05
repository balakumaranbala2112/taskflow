import AppError from "../utils/AppError.js";

const notFound = (req, res, next) => {
  const error = new AppError(
    `Route not Found: ${req.method} ${req.originalUrl}`,
    404,
  );

  next(error);
};

export default notFound;
