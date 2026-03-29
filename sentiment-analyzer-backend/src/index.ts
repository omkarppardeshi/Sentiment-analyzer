/**
 * Main Express Application Entry Point
 *
 * KEY CONCEPTS:
 * - Default export: Export a single item as the default export
 * - App configuration: Setting up middleware, routes, and server
 * - Environment variables: Configuration via process.env
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Import routes
import apiRouter from './routes/api.js';

// Import middleware
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Create Express application instance
// Application: The main Express object that holds all configuration
const app: Application = express();

// Parse JSON request bodies
// Built-in middleware: express.json() parses JSON bodies
app.use(express.json());

// Parse URL-encoded request bodies
// extended: true allows parsing nested objects
app.use(express.urlencoded({ extended: true }));

// Security middleware
// helmet: Sets various HTTP headers for security
app.use(helmet());

// CORS middleware - Enable Cross-Origin Resource Sharing
// KEY CONCEPT: CORS allows frontend on different origin to call our API
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Get allowed origins from environment variable
    const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
      .split(',')
      .map((o) => o.trim());

    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow cookies
};

app.use(cors(corsOptions));

// Logging middleware
// morgan: HTTP request logger middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Apply general rate limiting to all API routes
app.use('/api', apiLimiter);

// Health check at root level
app.get('/', (_req, res) => {
  res.json({
    name: 'Sentiment Analyzer API',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      health: 'GET /api/health',
      stats: 'GET /api/stats',
      analyze: 'POST /api/analyze',
    },
  });
});

// Mount API routes
// All routes in apiRouter will be prefixed with /api
app.use('/api', apiRouter);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last middleware
// KEY CONCEPT: Express error handling middleware takes 4 parameters
// The 'err' parameter is typed as 'unknown' and needs type narrowing
app.use(errorHandler);

// Start server only if this file is run directly (not imported)
const PORT = Number(process.env.PORT) || 3001;

// Default export for testing
// KEY CONCEPT: Exporting app allows supertest to import and test routes
export default app;

// Only start server in main context (not when imported as module)
if (process.argv[1] && process.argv[1].includes('index.ts')) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}
