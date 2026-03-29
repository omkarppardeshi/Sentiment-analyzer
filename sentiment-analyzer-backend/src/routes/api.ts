/**
 * API Routes
 *
 * KEY CONCEPTS:
 * - Express Router: Groups related routes together
 * - Route handlers: Functions that handle specific HTTP methods
 * - Async route handlers: Wrapped with async/await for clean Promise handling
 */

import { Router, Request, Response } from 'express';
import { analyzeValidationRules, validate } from '../middleware/validation.js';
import { analysisLimiter } from '../middleware/rateLimiter.js';
import { analyzeSentiment, checkApiHealth } from '../services/huggingFaceService.js';
import { recordAnalysis, getStats } from '../utils/stats.js';
import { ApiError } from '../types/index.js';

// Create router instance
// Router acts like a mini-app, allowing us to group routes
const router = Router();

/**
 * GET /api/health
 *
 * Health check endpoint for monitoring and load balancers.
 * Returns server status and uptime information.
 */
router.get('/health', async (req: Request, res: Response) => {
  // Check external API health
  const hfHealthy = await checkApiHealth();

  res.json({
    status: hfHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    services: {
      huggingFaceApi: hfHealthy ? 'operational' : 'degraded',
    },
  });
});

/**
 * GET /api/stats
 *
 * Returns usage statistics.
 * Useful for monitoring and dashboards.
 */
router.get('/stats', (req: Request, res: Response) => {
  const stats = getStats();
  res.json(stats);
});

/**
 * POST /api/analyze
 *
 * Analyze sentiment of input text.
 *
 * KEY CONCEPT: Async route handler wrapped with try/catch for error handling.
 * The analysisLimiter adds rate limiting specifically to this endpoint.
 */
router.post(
  '/analyze',
  analysisLimiter, // Apply rate limiting first
  analyzeValidationRules, // Then run validation
  validate, // Check validation results
  async (req: Request, res: Response, next: (err: unknown) => void) => {
    try {
      // Type assertion: Tell TypeScript we expect body to have 'text' field
      // This is safe because we've already validated with express-validator
      const text = req.body.text as string;

      // Call the Hugging Face service
      const result = await analyzeSentiment(text);

      // Record for statistics
      recordAnalysis(result.label, result.score);

      // Return successful response
      res.status(200).json(result);
    } catch (error) {
      // Pass errors to error handling middleware
      next(error);
    }
  }
);

export default router;
