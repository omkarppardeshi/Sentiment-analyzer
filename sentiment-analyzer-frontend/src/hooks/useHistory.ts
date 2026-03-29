/**
 * Custom Hook: useHistory
 *
 * KEY CONCEPTS:
 * - Custom hook: State + side effects combined
 * - useEffect: Side effect for loading from localStorage
 * - Generic type: Type-safe history array
 */

import { useState, useEffect, useCallback } from 'react';
import type { HistoryItem } from '@/types';
import { getHistory, saveHistory, clearHistoryStorage } from '@/lib/utils';

/**
 * Return type for the history hook
 */
interface UseHistoryReturn {
  // Current history
  history: HistoryItem[];
  // Check if history is loaded
  isLoaded: boolean;
  // Clear all history
  clearHistory: () => void;
  // Refresh history from localStorage
  refreshHistory: () => void;
}

/**
 * Custom hook for managing sentiment analysis history
 *
 * KEY CONCEPTS:
 * - useEffect: Load history on mount (client-side only)
 * - Dependency array: Control when effect runs
 * - Callback memoization: Stable function references
 */
export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from localStorage on mount
  // KEY CONCEPT: useEffect with empty deps runs once on mount
  useEffect(() => {
    const stored = getHistory();
    setHistory(stored);
    setIsLoaded(true);
  }, []);

  /**
   * Clear all history
   * KEY CONCEPT: Side effect function
   */
  const clearHistory = useCallback(() => {
    clearHistoryStorage();
    setHistory([]);
  }, []);

  /**
   * Refresh history from localStorage
   * KEY CONCEPT: Read from localStorage and update state
   */
  const refreshHistory = useCallback(() => {
    const stored = getHistory();
    setHistory(stored);
  }, []);

  return {
    history,
    isLoaded,
    clearHistory,
    refreshHistory,
  };
}
