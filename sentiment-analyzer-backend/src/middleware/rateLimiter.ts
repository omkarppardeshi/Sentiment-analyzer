/**
 * Rate Limiting Middleware
 *
 * KEY CONCEPTS:
 * - Rate limiting: Prevents abuse by limiting request frequency
 * - express-rate-limit: Popular middleware for Express rate limiting
 * - Generic type parameters: Customizing the limit handler message
 */

import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Default rate limiter for general API endpoints
 *
 * KEY CONCEPT: Generic types in rateLimit options allow customizing
 * the key generator, skip function, and handler while maintaining type safety
 */
export const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests per window
  message: {
    error: 'Too Many Requests',
    message: 'Please try again later',
    statusCode: 429,
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  // Key generator: Extract client identifier for rate limiting
  keyGenerator: (req: Request): string => {
    // Use IP address as default identifier
    // In production, consider using user ID for authenticated routes
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
  // Custom handler for when limit is exceeded
  handler: (_req: Request, res: Response): void => {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again in 15 minutes.',
      statusCode: 429,
    });
  },
});

/**
 * Strict limiter for analysis endpoint
 * Lower limit specifically for the resource-intensive analysis endpoint
 */
export const analysisLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 30, // 30 requests per minute (stricter than general API)
  message: {
    error: 'Too Many Requests',
    message: 'Analysis rate limit exceeded. Please slow down.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
