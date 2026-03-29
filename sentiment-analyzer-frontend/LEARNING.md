# Learning Guide - Sentiment Analyzer Frontend

## Key TypeScript Concepts Used

### 1. Interfaces vs Types

**Interface** - Defines the shape of an object:
```typescript
interface AnalyzeResponse {
  label: 'POSITIVE' | 'NEGATIVE';  // Union literal type
  score: number;
  text: string;
  analyzedAt: string;
}
```

**Type Alias** - Creates a new name for any type:
```typescript
type AnalysisState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: AnalyzeResponse }
  | { status: 'error'; error: string };
```

### 2. Discriminated Unions

A union where each member has a common "discriminator" property:
```typescript
type AnalysisState =
  | { status: 'idle' }           // status is the discriminator
  | { status: 'loading' }
  | { status: 'success'; data: AnalyzeResponse }  // + payload
  | { status: 'error'; error: string };           // + error payload

// Usage:
if (state.status === 'success') {
  console.log(state.data); // TypeScript knows data exists here
}
```

### 3. Generic Types

Creating reusable components that work with multiple types:
```typescript
// Generic function
function apiFetch<T>(url: string): Promise<ApiResult<T>> {
  // Returns T based on what was requested
}

// Usage:
const result = await apiFetch<AnalyzeResponse>('/analyze');
```

### 4. Type Guards

Functions that narrow down union types:
```typescript
function isErrorResponse(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'statusCode' in response
  );
}
```

### 5. React.FC and Component Props

```typescript
// Explicit props type
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive';
  asChild?: boolean;
}

// Using forwardRef for DOM access
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return <button ref={ref} className={className} {...props} />;
  }
);
```

### 6. Custom Hooks

Extracting reusable stateful logic:
```typescript
function useSentimentAnalysis() {
  const [state, setState] = useState<AnalysisState>({ status: 'idle' });

  const analyze = useCallback(async (text: string) => {
    setState({ status: 'loading' });
    // ... analysis logic
  }, []);

  return { state, analyze, reset };
}
```

### 7. Next.js App Router Types

**Server Components** (default):
```typescript
// layout.tsx - Server Component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html>{children}</html>;
}
```

**Client Components** ('use client'):
```typescript
// page.tsx - Client Component
'use client';
export default function HomePage() {
  const [text, setText] = useState('');
  // ...
}
```

### 8. Polymorphic Components

Components that render as different HTML elements:
```typescript
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';  // Dynamic component
    return <Comp ref={ref} {...props} />;
  }
);
```

### 9. Variant Props with CVA

Class Variance Authority for component variants:
```typescript
const buttonVariants = cva(
  'base-classes',
  {
    variants: {
      variant: { default: '...', destructive: '...' },
      size: { default: '...', sm: '...' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);
```

### 10. ReturnType Utility

Getting the return type of a function:
```typescript
type ToastContextType = ReturnType<typeof useToast>;
```

## Key React/Next.js Patterns

### 1. Client vs Server Components

**Server Components:**
- Run on server
- Can access backend directly
- No hooks or browser APIs
- Default in App Router

**Client Components:**
- Run in browser (with SSR)
- Can use hooks and interactivity
- Marked with 'use client'

### 2. Custom Hook Pattern

```typescript
// Hook encapsulates state + logic
function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = getHistory();
    setHistory(stored);
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem('sentiment-history');
    setHistory([]);
  }, []);

  return { history, clearHistory };
}
```

### 3. Context API for Global State

```typescript
const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

function ToastProvider({ children }: { children: React.ReactNode }) {
  const value = useToast();
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
```

### 4. Tailwind CSS Dark Mode

```css
// globals.css
.dark {
  --background: 222.2 84% 4.9%;
}
```

```tsx
<div className="dark:bg-background">
```

## Interview Talking Points

### 1. Why TypeScript?

- Catch errors at compile time, not runtime
- Self-documenting code with interfaces
- Better IDE support and refactoring
- Documentation through types

### 2. Discriminated Unions for State

```typescript
// vs traditional boolean flags
type State = 'idle' | 'loading' | 'success' | 'error';

// Each state is explicit
// Impossible to have data AND error at same time
// Easy to exhaustive checking with switch
```

### 3. Custom Hooks for Reusability

- Share stateful logic between components
- Testable in isolation
- Single responsibility

### 4. Next.js App Router Benefits

- Server Components reduce bundle size
- Streaming for better UX
- Layouts for persistent UI
- Server actions for mutations

### 5. Why shadcn/ui?

- Not a component library - copy/paste source
- Full control over customization
- Built on Radix primitives for accessibility
- Consistent design language

## Further Learning

- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [React Hooks](https://react.dev/reference/react)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/)
