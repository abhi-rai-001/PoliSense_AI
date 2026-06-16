/**
 * Middleware index file
 * Exports all middleware functions for easier importing
 */

import logger from './logger.middleware.js';
import errorHandler from './error.middleware.js';
import validate from './validator.middleware.js';
import { cacheMiddleware, clearCache } from './cache.middleware.js';

export {
  logger,
  errorHandler,
  validate,
  cacheMiddleware,
  clearCache
};