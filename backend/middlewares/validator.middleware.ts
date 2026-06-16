/**
 * Request validation middleware
 * Validates incoming requests against defined schemas
 */

const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request body against schema
      const { error } = schema.validate(req.body);
      
      if (error) {
        // Return validation error with details
        return res.status(400).json({
          success: false,
          status: 400,
          message: 'Validation Error',
          errors: error.details.map(detail => ({
            message: detail.message,
            path: detail.path
          })),
          timestamp: new Date().toISOString()
        });
      }
      
      // If validation passes, continue
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validate;