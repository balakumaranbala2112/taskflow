/**
 * Send a standardized success response.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Human-readable success message
 * @param {*} [data=null] - Response payload
 */
export const sendSuccess = (res, statusCode = 200, message = "Operation successful", data = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (Array.isArray(data)) {
    response.count = data.length;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a standardized error response.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Human-readable error message
 * @param {Array} [errors=null] - Optional validation error details
 */
export const sendError = (res, statusCode = 500, message = "Internal server error", errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
