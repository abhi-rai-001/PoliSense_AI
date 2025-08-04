/**
 * Logger middleware for tracking API requests and responses
 */

const logger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip } = req;
  
  // Log request details
  console.log(`[${new Date().toISOString()}] ${method} ${url} - IP: ${ip}`);
  
  // Capture response
  const originalSend = res.send;
  res.send = function(body) {
    const responseTime = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${method} ${url} - Status: ${res.statusCode} - Response Time: ${responseTime}ms`);
    return originalSend.call(this, body);
  };
  
  next();
};

export default logger;