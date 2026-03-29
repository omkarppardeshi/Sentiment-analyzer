# Learning Guide - Sentiment Analyzer Backend

## Key TypeScript Concepts Used

### 1. Interfaces vs Types

**Interface** - Defines the shape of an object (contract):
```typescript
interface AnalyzeResponse {
  label: 'POSITIVE' | 'NEGATIVE';  // Literal union type
  score: number;
  text: string;
}
```

**Type Alias** - Creates a new name for a type:
```typescript
type ErrorResponse = {
  error: string | string[];  // Union type
  message: string;
  statusCode: number;
};
```

**When to use each:**
- Interface: When defining object shapes that might be extended/implemented
- Type: For unions, primitives, or when you need to alias complex types

### 2. Union Types

A value that can be one of several types:
```typescript
type Status = 'pending' | 'success' | 'error';
let currentStatus: Status;  // Can only be one of these 3 strings
```

Used in our code for `label: 'POSITIVE' | 'NEGATIVE'`.

### 3. Generics

Create reusable components that work with multiple types:
```typescript
function recordAnalysis<T extends { label: string; score: number }>(
  result: T
): void {
  // T can be any object with label and score
}
```

### 4. Type Guards

Functions that narrow down union types:
```typescript
function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
```

The `error is ApiError` is a **type predicate** - it tells TypeScript that if the function returns true, the error is an ApiError.

### 5. The `unknown` Type

Safer alternative to `any`:
```typescript
function handleError(err: unknown): void {
  if (isApiError(err)) {
    // TypeScript knows err is ApiError here
    console.log(err.statusCode);
  }
}
```

### 6. Type Assertions

Tell TypeScript the type when you know better:
```typescript
const text = req.body.text as string;
```

### 7. Extending Built-in Errors

```typescript
class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);  // Call parent constructor
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}
```

### 8. Async/Await with Promises

```typescript
async function analyzeSentiment(text: string): Promise<AnalyzeResponse> {
  const result = await hf.textClassification({...});
  return result;
}
```

## Hugging Face API Integration

### How It Works

1. **Client Setup**:
   ```typescript
   import { HfInference } from '@huggingface/inference';
   const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
   ```

2. **Making Requests**:
   ```typescript
   const result = await hf.textClassification({
     model: 'distilbert-base-uncased-finetuned-sst-2-english',
     inputs: 'I love this!',
   });
   ```

3. **Response Structure**:
   ```typescript
   [
     { label: 'POSITIVE', score: 0.999 },
     { label: 'NEGATIVE', score: 0.001 }
   ]
   ```

### Model: DistilBERT Fine-tuned on SST-2

- **Base Model**: DistilBERT (lighter, faster BERT)
- **Fine-tuned on**: Stanford Sentiment Treebank 2
- **Task**: Binary sentiment classification (positive/negative)
- **API**: Free tier includes 30k Hugging Face tokens/month

### Error Handling Strategy

1. Validate input locally first
2. Catch API errors and map to user-friendly messages
3. Return appropriate HTTP status codes
4. Never expose internal error details in production

## Architecture Decisions

### Why Express Router?

```typescript
const router = Router();
router.get('/health', handler);
export default router;
```

- Groups related routes together
- Can mount at different paths (e.g., `/api`, `/v2/api`)
- Easier to test - mount in isolation

### Middleware Order

```
Request → CORS → Helmet → Rate Limit → Validation → Route Handler
                                          ↓
Response ← Error Handler ← (if error thrown)
```

### Why Module-Level State for Stats?

```typescript
const stats = { totalRequests: 0, ... };
export function recordAnalysis() { ... }
```

- Simple singleton pattern
- Works for single-instance servers
- Easy to reset for testing
- Note: In serverless/multi-instance, use Redis instead

## Interview Talking Points

### 1. TypeScript Benefits in Production
- Catch errors at compile time, not runtime
- Self-documenting code with interfaces
- Better IDE support (autocomplete, refactoring)
- Safer refactoring

### 2. Error Handling Patterns
- Custom error classes with status codes
- Centralized error handling middleware
- Type-safe error discrimination with type guards
- Never expose internal errors to clients

### 3. API Design Principles
- RESTful endpoint naming
- Consistent response structures
- Proper HTTP status codes
- Rate limiting for DoS protection
- Input validation (never trust client)

### 4. Security Considerations
- CORS configuration
- Helmet for security headers
- Input sanitization (escape XSS)
- Rate limiting
- Environment variables for secrets

### 5. Scaling Considerations
- Current: In-memory stats (single instance)
- Future: Redis for multi-instance stats
- Future: Request caching with Redis/Memcached
- Rate limiting can use Redis for distributed setup

## Further Learning

- **Express Middleware**: https://expressjs.com/en/guide/using-middleware.html
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Hugging Face Inference API**: https://huggingface.co/docs/api-inference/
- **REST API Best Practices**: https://restfulapi.net/
