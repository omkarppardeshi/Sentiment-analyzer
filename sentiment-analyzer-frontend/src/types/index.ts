/**
 * TypeScript Type Definitions for Sentiment Analyzer Frontend
 *
 * KEY CONCEPTS:
 * - Interface: Defines the shape of an object (contract)
 * - Type Alias: Creates a new name for an existing type
 * - Union Types: Allows a value to be one of several types
 * - Generic Types: Create reusable components that work with multiple types
 */

/**
 * Request body for sentiment analysis
 * Interface: Defines what we send to the API
 */
export interface AnalyzeRequest {
  text: string;
}

/**
 * Response from sentiment analysis endpoint
 * Interface: Defines what we receive from the API
 */
export interface AnalyzeResponse {
  label: 'POSITIVE' | 'NEGATIVE';
  score: number;
  text: string;
  analyzedAt: string;
}

/**
 * Error response from API
 * Union type: error can be a string OR an array of strings
 */
export interface ApiErrorResponse {
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
  services?: {
    huggingFaceApi?: string;
  };
}

/**
 * Statistics response
 */
export interface StatsResponse {
  totalRequests: number;
  averageConfidence: number;
  positiveCount: number;
  negativeCount: number;
  uptime: number;
}

/**
 * History item stored in localStorage
 * Extends AnalyzeResponse with additional metadata
 */
export interface HistoryItem extends AnalyzeResponse {
  id: string; // Unique identifier for the item
}

/**
 * App state for sentiment analysis
 * Union type: represents all possible states of the analysis
 */
export type AnalysisState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: AnalyzeResponse }
  | { status: 'error'; error: string };

/**
 * Chart data for pie chart
 * Generic type T constrains what properties the data must have
 */
export interface ChartDataPoint<T extends string = string> {
  name: T; // Type parameter with default
  value: number;
  // Color is optional - computed elsewhere
  fill?: string;
}

/**
 * Type guard to check if response is an error
 * Type guard: narrows down the union type
 */
export function isErrorResponse(
  response: unknown
): response is ApiErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'statusCode' in response &&
    'error' in response
  );
}

/**
 * Discriminated union for API responses
 * The 'ok' field acts as the discriminator
 */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
