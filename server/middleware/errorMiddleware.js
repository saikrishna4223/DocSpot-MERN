// middleware/errorMiddleware.js
// Custom error handling middleware functions

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the next middleware (errorHandler)
};

const errorHandler = (err, req, res, next) => {
  // Determine the status code: if it's a 200 series (success) but an error occurred,
  // change it to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // In production, stack trace should not be exposed
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
