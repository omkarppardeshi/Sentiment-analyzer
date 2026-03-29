/**
 * TypeScript Type Definitions for Sentiment Analyzer API
 *
 * KEY CONCEPTS:
 * - Interface: Defines the shape/contract of an object
 * - Type Alias: Creates a new name for an existing type
 * - Union Types: Allows a value to be one of several types
 * - Generics: Create reusable components that work with multiple types
 */

/**
 * Request body for sentiment analysis endpoint
 * Interface: Defines what the client must send
 */
export interface AnalyzeRequest {
  text: string;
}

/**
 * Response from sentiment analysis endpoint
 * Generic type parameter T allows for flexible response shapes
 */
export interface AnalyzeResponse {
  label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  score: number;
  text: string;
  analyzedAt: string;
}

/**
 * Error response structure
 * Union type: error can be a string OR an array of strings (for validation errors)
 */
export interface ErrorResponse {
  error: string | string[];
  message: string;
  statusCode: number;
}

/**
 * Health check response
 */
export interface HealthResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  uptime: number;
  environment: string;
}

/**
 * Usage statistics response
 */
export interface StatsResponse {
  totalRequests: number;
  averageConfidence: number;
  positiveCount: number;
  negativeCount: number;
  uptime: number;
}

/**
 * Custom error class for API-specific errors
 * Extends built-in Error class to add statusCode
 */
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

/**
 * Type guard to check if value is ApiError
 * Type guard: A function that narrows down a union type
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Stats tracking interface (internal use)
 */
export interface Stats {
  totalRequests: number;
  positiveCount: number;
  negativeCount: number;
  confidenceSum: number;
  startTime: number;
}
