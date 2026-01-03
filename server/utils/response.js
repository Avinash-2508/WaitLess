/**
 * Send success response
 * @param {object} res - Express response object
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code (default 200)
 */
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data }),
  });
};

/**
 * Send error response
 * @param {object} res - Express response object
 * @param {string} error - Error message
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {*} details - Additional error details
 */
const sendError = (res, error, statusCode = 500, details = null) => {
  res.status(statusCode).json({
    success: false,
    error,
    ...(details && { details }),
  });
};

/**
 * Send validation error
 * @param {object} res - Express response object
 * @param {array|string} errors - Validation errors
 */
const sendValidationError = (res, errors) => {
  const errorArray = Array.isArray(errors) ? errors : [errors];
  res.status(400).json({
    success: false,
    error: "Validation failed",
    details: errorArray,
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
};
