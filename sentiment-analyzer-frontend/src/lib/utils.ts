/**
 * Utility Functions
 *
 * KEY CONCEPTS:
 * - Utility functions: Pure functions that perform common operations
 * - Type-safe localStorage: Wrapper functions with proper typing
 * - Class name merging: Combining Tailwind classes conditionally
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { HistoryItem } from '@/types';

/**
 * Merge Tailwind CSS classes conditionally
 * Uses clsx for simple conditionals and twMerge for deduplication
 *
 * KEY CONCEPT: Generic function - works with any type extending ClassValue
 * @example
 * cn('text-red-500', isActive && 'bg-blue-500', 'p-4')
 * cn('px-2', 'py-2', 'px-2') // returns 'py-2 px-2' (deduped)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 * @param dateString - ISO date string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get stored history from localStorage
 *
 * KEY CONCEPT: Generic type annotation for localStorage
 * JSON.parse returns 'unknown' so we need type assertion
 */
export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return []; // SSR safety

  try {
    const stored = localStorage.getItem('sentiment-history');
    // Type assertion: We know what we stored, but JSON.parse doesn't
    return (stored ? JSON.parse(stored) : []) as HistoryItem[];
  } catch {
    return [];
  }
}

/**
 * Save history to localStorage
 */
export function saveHistory(history: HistoryItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    // Only keep last 10 items
    const trimmed = history.slice(-10);
    localStorage.setItem('sentiment-history', JSON.stringify(trimmed));
  } catch {
    // localStorage might be full or disabled
    console.warn('Could not save to localStorage');
  }
}

/**
 * Clear all history from localStorage
 */
export function clearHistoryStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('sentiment-history');
}

/**
 * Generate unique ID
 * KEY CONCEPT: Template literal type in action
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Calculate confidence percentage
 * @param score - Score between 0 and 1
 */
export function getConfidencePercent(score: number): string {
  return `${(score * 100).toFixed(1)}%`;
}

/**
 * Get color based on sentiment
 * @param label - 'POSITIVE' or 'NEGATIVE'
 */
export function getSentimentColor(
  label: 'POSITIVE' | 'NEGATIVE'
): { bg: string; text: string; border: string } {
  if (label === 'POSITIVE') {
    return {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
    };
  }
  return {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  };
}
