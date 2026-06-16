/**
 * Cache middleware
 * Implements in-memory caching for API responses
 */

// Simple in-memory cache
const cache = new Map();

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const cacheMiddleware = (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }
  
  // Create a cache key from the request URL
  const cacheKey = req.originalUrl;
  
  // Check if we have a cached response
  const cachedResponse = cache.get(cacheKey);
  
  if (cachedResponse) {
    // Check if cache is still valid
    const now = Date.now();
    if (now < cachedResponse.expiresAt) {
      // Return cached response
      console.log(`[CACHE] Hit for ${cacheKey}`);
      return res.json(cachedResponse.data);
    } else {
      // Cache expired, remove it
      console.log(`[CACHE] Expired for ${cacheKey}`);
      cache.delete(cacheKey);
    }
  }
  
  // Cache miss, capture the response
  const originalSend = res.json;
  res.json = function(body) {
    // Only cache successful responses
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log(`[CACHE] Miss for ${cacheKey}, storing in cache`);
      cache.set(cacheKey, {
        data: body,
        expiresAt: Date.now() + CACHE_DURATION
      });
    }
    
    // Call the original json method
    return originalSend.call(this, body);
  };
  
  next();
};

// Helper function to clear cache
const clearCache = (key = null) => {
  if (key) {
    cache.delete(key);
    console.log(`[CACHE] Cleared for ${key}`);
  } else {
    cache.clear();
    console.log('[CACHE] Completely cleared');
  }
};

export { cacheMiddleware, clearCache };