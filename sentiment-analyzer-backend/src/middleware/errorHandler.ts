/**
 * Error Handling Middleware
 *
 * KEY CONCEPTS:
 * - Express Middleware: Functions that process requests/responses
 * - Error handling middleware: Special middleware with (err, req, res, next) signature
 * - Type assertions: Using 'as' to tell TypeScript the correct type
 */

import { Request, Response, NextFunction } from 'express';
import { ApiError, isApiError } from '../types/index.js';

/**
 * Not Found Handler
 *
 * Called when no route matches the request path.
 * This is placed AFTER all routes are defined.
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    statusCode: 404,
  });
}

/**
 * Global Error Handler Middleware
 *
 * KEY CONCEPT: Error handling middleware takes 4 parameters.
 * The 'err' parameter is typed as 'unknown' because errors can be any type.
 * We use type guards (isApiError) to narrow the type before using it.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error for debugging (in production, use proper logging)
  console.error('Error:', err);

  // Handle ApiError instances with proper status codes
  if (isApiError(err)) {
    res.status(err.statusCode).json({
      error: err.message,
      message: err.message,
      statusCode: err.statusCode,
    });
    return;
  }

  // Handle validation errors from express-validator
  if (err instanceof Error && err.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      statusCode: 400,
    });
    return;
  }

  // Handle unknown errors with generic 500 response
  // Never expose internal error details in production
  const message =
    process.env.NODE_ENV === 'development'
      ? (err as Error).message || 'Internal Server Error'
      : 'An unexpected error occurred';

  res.status(500).json({
    error: 'Internal Server Error',
    message,
    statusCode: 500,
  });
}
