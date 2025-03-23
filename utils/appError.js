class AppError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);

    this.errorBucket = errors;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "FAIL" : "ERROR";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
