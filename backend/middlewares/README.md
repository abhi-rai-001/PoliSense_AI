# Middlewares Documentation

This directory contains middleware functions used throughout the Polisense AI application.

## Available Middlewares

### Logger Middleware

**File:** `logger.middleware.js`

Tracks API requests and responses with timing information. Useful for monitoring and debugging.

**Usage:**
```javascript
import { logger } from './middlewares/index.js';
app.use(logger);
```

### Error Handler Middleware

**File:** `error.middleware.js`

Provides consistent error response format across the application. Should be added after all routes.

**Usage:**
```javascript
import { errorHandler } from './middlewares/index.js';
app.use(errorHandler);
```

### Validation Middleware

**File:** `validator.middleware.js`

Validates incoming requests against defined Joi schemas.

**Usage:**
```javascript
import { validate } from './middlewares/index.js';
import Joi from 'joi';

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required()
});

app.post('/api/users', validate(userSchema), userController.createUser);
```

### Cache Middleware

**File:** `cache.middleware.js`

Implements in-memory caching for API responses to improve performance.

**Usage:**
```javascript
import { cacheMiddleware, clearCache } from './middlewares/index.js';

// Apply globally
app.use('/api', cacheMiddleware);

// Or apply to specific routes
app.get('/api/data', cacheMiddleware, dataController.getData);

// Clear cache when data changes
app.post('/api/data', (req, res) => {
  // Process request...
  clearCache('/api/data');
  res.json({ success: true });
});
```

## Best Practices

1. **Order matters**: The order in which middlewares are applied can affect behavior.
2. **Selective application**: Apply middlewares only where needed to optimize performance.
3. **Error handling**: Always ensure error middleware is registered after all routes.
4. **Caching strategy**: Be careful with caching dynamic or user-specific content.