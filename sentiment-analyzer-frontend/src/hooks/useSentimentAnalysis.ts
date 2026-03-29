/**
 * Custom Hook: useSentimentAnalysis
 *
 * KEY CONCEPTS:
 * - Custom hooks: Reusable stateful logic extracted to a function
 * - Generic types: Type-safe hooks that work with specific data shapes
 * - useCallback: Memoized functions to prevent unnecessary re-renders
 * - Dependency arrays: Controlling when callbacks are recreated
 */

import { useState, useCallback } from 'react';
import type { AnalyzeResponse, AnalysisState } from '@/types';
import { analyzeSentiment } from '@/lib/api';
import { getHistory, saveHistory, generateId } from '@/lib/utils';
import type { HistoryItem } from '@/types';

/**
 * Return type for the sentiment analysis hook
 * KEY CONCEPT: Interface defining the contract of our custom hook
 */
interface UseSentimentAnalysisReturn {
  // Current analysis state (discriminated union)
  state: AnalysisState;
  // Function to trigger analysis
  analyze: (text: string) => Promise<void>;
  // Reset to idle state
  reset: () => void;
}

/**
 * Custom hook for sentiment analysis
 *
 * KEY CONCEPTS:
 * - Generic: Works with AnalyzeResponse type
 * - State management: Handles loading/success/error states
 * - Side effects: Updates localStorage history on success
 */
export function useSentimentAnalysis(): UseSentimentAnalysisReturn {
  // Use discriminated union for type-safe state
  // KEY CONCEPT: Union type ensures only valid states are possible
  const [state, setState] = useState<AnalysisState>({ status: 'idle' });

  /**
   * Analyze text sentiment
   * KEY CONCEPT: Async function with proper error handling
   */
  const analyze = useCallback(async (text: string) => {
    // Validate input
    if (!text.trim()) {
      setState({
        status: 'error',
        error: 'Please enter some text to analyze',
      });
      return;
    }

    if (text.length > 500) {
      setState({
        status: 'error',
        error: 'Text exceeds maximum length of 500 characters',
      });
      return;
    }

    // Set loading state
    setState({ status: 'loading' });

    try {
      const result = await analyzeSentiment(text);

      if (result.ok) {
        // Success - update state with data
        setState({ status: 'success', data: result.data });

        // Save to history
        const historyItem: HistoryItem = {
          ...result.data,
          id: generateId(),
        };
        const history = getHistory();
        saveHistory([...history, historyItem]);
      } else {
        // API error
        setState({ status: 'error', error: result.error });
      }
    } catch (error) {
      // Unexpected error
      setState({
        status: 'error',
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  }, []); // Empty deps - function reference is stable

  const reset = useCallback(() => {
    setState({ status: 'idle' });
  }, []);

  return { state, analyze, reset };
}
