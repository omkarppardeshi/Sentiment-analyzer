/**
 * API Client
 *
 * KEY CONCEPTS:
 * - Fetch wrapper: Centralized API calls with error handling
 * - Generic types: Type-safe API responses
 * - Type predicates: Type guards for narrowing union types
 */

import type {
  AnalyzeRequest,
  AnalyzeResponse,
  ApiErrorResponse,
  HealthResponse,
  StatsResponse,
  ApiResult,
} from '@/types';

// API base URL from environment
// NEXT_PUBLIC_ prefix makes it available in browser
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Type guard to check if response is an error
 */
function isErrorResponse(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'statusCode' in response &&
    'error' in response
  );
}

/**
 * Generic fetch wrapper with error handling
 *
 * KEY CONCEPT: Generic type parameter T specifies expected response type
 * @param url - API endpoint
 * @param options - Fetch options
 * @returns Promise with typed result
 */
async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    // Check for API error response
    if (!response.ok || isErrorResponse(data)) {
      const errorMessage =
        typeof data.message === 'string'
          ? data.message
          : Array.isArray(data.message)
            ? data.message.join(', ')
            : 'An error occurred';

      return { ok: false, error: errorMessage };
    }

    return { ok: true, data: data as T };
  } catch (error) {
    // Network error or JSON parsing failed
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { ok: false, error: 'Unable to connect to the server' };
    }

    return {
      ok: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

/**
 * Analyze sentiment of text
 * @param text - Text to analyze
 * @returns Promise with analysis result
 */
export async function analyzeSentiment(
  text: string
): Promise<ApiResult<AnalyzeResponse>> {
  const request: AnalyzeRequest = { text };

  return apiFetch<AnalyzeResponse>('/analyze', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Check API health
 * @returns Promise with health status
 */
export async function checkHealth(): Promise<ApiResult<HealthResponse>> {
  return apiFetch<HealthResponse>('/health');
}

/**
 * Get usage statistics
 * @returns Promise with stats
 */
export async function getStats(): Promise<ApiResult<StatsResponse>> {
  return apiFetch<StatsResponse>('/stats');
}
