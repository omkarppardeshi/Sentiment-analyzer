/**
 * Request Validation Middleware
 *
 * KEY CONCEPTS:
 * - express-validator: Middleware for validating and sanitizing request data
 * - ValidationChain: A chain of validators for a single field
 * - body(): Validates request body fields
 * - ValidationError: Error thrown when validation fails
 */

import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Validation rule for text analysis request
 *
 * KEY CONCEPT: ValidationChain is a fluent API for building validators.
 * Each .method() call adds a new validation rule.
 */
export const analyzeValidationRules: ValidationChain[] = [
  // 'body()' creates validators for request.body properties
  body('text')
    .exists()
    .withMessage('Text field is required')
    .isString()
    .withMessage('Text must be a string')
    .notEmpty()
    .withMessage('Text cannot be empty')
    .isLength({ min: 1, max: 500 })
    .withMessage('Text must be between 1 and 500 characters')
    .trim() // Remove leading/trailing whitespace
    .escape(), // Escape HTML characters to prevent XSS
];

/**
 * Validation middleware to check results of express-validator
 *
 * KEY CONCEPT: Middleware function that runs AFTER validators.
 * Checks if validation passed, otherwise returns first error.
 */
export function validate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // validationResult() extracts validation errors from the request
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // errors.array() returns validation error objects
    const errorMessages = errors.array().map((err) => err.msg);

    res.status(400).json({
      error: 'Validation Error',
      message: errorMessages,
      statusCode: 400,
    });
    return;
  }

  // Validation passed, continue to next middleware
  next();
}
