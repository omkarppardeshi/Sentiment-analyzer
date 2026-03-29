/**
 * Stats Tracking Utility
 *
 * KEY CONCEPTS:
 * - Module-level state: Variables that persist across requests
 * - Singleton pattern: One instance shared across the application
 * - Namespace object: Object that holds related state
 */

import type { Stats, StatsResponse } from '../types/index.js';

/**
 * Singleton stats object
 * KEY CONCEPT: Module-level variable maintains state across requests.
 * This is simple but works well for single-instance servers.
 */
const stats: Stats = {
  totalRequests: 0,
  positiveCount: 0,
  negativeCount: 0,
  confidenceSum: 0,
  startTime: Date.now(),
};

/**
 * Record an analysis result
 * Mutates the stats object directly (side effect)
 * NEUTRAL is counted as negative for simplicity
 */
export function recordAnalysis(label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL', score: number): void {
  stats.totalRequests++;
  stats.confidenceSum += score;

  if (label === 'POSITIVE') {
    stats.positiveCount++;
  } else {
    stats.negativeCount++;
  }
}

/**
 * Get current statistics
 *
 * KEY CONCEPT: Pure function - doesn't mutate state, just reads it.
 * Returns a new StatsResponse object with calculated fields.
 */
export function getStats(): StatsResponse {
  const uptime = Math.floor((Date.now() - stats.startTime) / 1000);

  return {
    totalRequests: stats.totalRequests,
    averageConfidence:
      stats.totalRequests > 0
        ? Number((stats.confidenceSum / stats.totalRequests).toFixed(4))
        : 0,
    positiveCount: stats.positiveCount,
    negativeCount: stats.negativeCount,
    uptime,
  };
}

/**
 * Reset statistics (useful for testing)
 */
export function resetStats(): void {
  stats.totalRequests = 0;
  stats.positiveCount = 0;
  stats.negativeCount = 0;
  stats.confidenceSum = 0;
  stats.startTime = Date.now();
}
