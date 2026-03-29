/**
 * Textarea Component
 *
 * KEY CONCEPTS:
 * - Forwarding ref: Parent can access the underlying DOM element
 * - Interface extending: Adding custom props to HTML attributes
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

// Extend HTML textarea attributes with custom props
// KEY CONCEPT: React.TextareaHTMLAttributes adds all standard textarea props
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          // Placeholder styling
          'placeholder:text-muted-foreground',
          // Focus ring
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          // Disabled state
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Resize
          'resize-y',
          // Custom className override
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
