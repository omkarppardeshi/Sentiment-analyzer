/**
 * Input Component
 *
 * KEY CONCEPTS:
 * - Forwarding ref: Allows parent to access the DOM element
 * - React.HTMLAttributes: Inherits all standard HTML input attributes
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

// Extend HTML input attributes with our custom props
// KEY CONCEPT: React.InputHTMLAttributes adds all standard input props
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          // Placeholder styling
          'placeholder:text-muted-foreground',
          // Focus ring
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          // Disabled state
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Custom className override
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
