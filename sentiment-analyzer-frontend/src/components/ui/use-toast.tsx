/**
 * Toast Hook and Provider
 *
 * KEY CONCEPTS:
 * - Custom Hook: Reusable stateful logic
 * - Context API: React's built-in state distribution
 * - Generic types in hooks: Type-safe state management
 */

'use client';

import * as React from 'react';
import type { ToastProps } from '@/components/ui/toast';

// Toast state type
// KEY CONCEPT: Using a state hook with a specific interface
type ToastState = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastProps['variant'];
  duration?: number;
};

type ActionType =
  | { type: 'ADD_TOAST'; toast: ToastState }
  | { type: 'REMOVE_TOAST'; id: string };

/**
 * Toast reducer for state management
 * KEY CONCEPT: Reducer pattern for predictable state updates
 */
function toastReducer(state: ToastState[], action: ActionType): ToastState[] {
  switch (action.type) {
    case 'ADD_TOAST':
      return [...state, action.toast];
    case 'REMOVE_TOAST':
      return state.filter((toast) => toast.id !== action.id);
    default:
      return state;
  }
}

/**
 * Custom hook to use toast
 *
 * KEY CONCEPTS:
 * - Generic useState: Type-safe state for toast array
 * - Return type annotation: Clear contract for hook consumers
 * - useCallback: Memoized function to prevent re-renders
 */
function useToast() {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastState, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 5000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    // Convenience methods
    success: (title: string, description?: string) =>
      addToast({ title, description, variant: 'success' }),
    error: (title: string, description?: string) =>
      addToast({ title, description, variant: 'destructive' }),
    info: (title: string, description?: string) =>
      addToast({ title, description }),
  };
}

// Create context with typed hook
// KEY CONCEPT: Context with generic type parameter
type ToastContextType = ReturnType<typeof useToast>;

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

/**
 * Toast provider component
 */
function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * Custom hook to access toast context
 * KEY CONCEPT: Type-safe context access with undefined check
 */
function useToastContext() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}

export { ToastProvider, useToastContext, useToast };
export type { ToastState };
