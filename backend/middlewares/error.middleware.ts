/**
 * Global error handling middleware
 * Provides consistent error response format across the application
 */

const errorHandler = (err, req, res, next) => {
  // Default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error details for debugging
  console.error(`[ERROR] ${req.method} ${req.url} - ${statusCode} - ${message}`);
  if (err.stack) {
    console.error(err.stack);
  }
  
  // Send standardized error response
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    timestamp: new Date().toISOString()
  });
};

export default errorHandler;