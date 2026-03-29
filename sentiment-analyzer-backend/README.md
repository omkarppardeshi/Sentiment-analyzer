# Sentiment Analyzer Backend API

Production-ready Express.js API for sentiment analysis using Hugging Face's DistilBERT model.

## Features

- **Hugging Face Integration**: Uses `distilbert-base-uncased-finetuned-sst-2-english` for sentiment analysis
- **TypeScript**: Full type safety with strict mode enabled
- **Rate Limiting**: Configurable rate limits to prevent abuse
- **Request Validation**: Input validation using express-validator
- **CORS Configuration**: Secure cross-origin requests
- **Health Monitoring**: Health check and statistics endpoints
- **Error Handling**: Comprehensive error handling middleware

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ML**: Hugging Face Inference API
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

## Project Structure

```
sentiment-analyzer-backend/
├── src/
│   ├── middleware/
│   │   ├── errorHandler.ts    # Global error handling
│   │   ├── rateLimiter.ts     # Rate limiting middleware
│   │   └── validation.ts      # Request validation
│   ├── routes/
│   │   └── api.ts             # API route handlers
│   ├── services/
│   │   └── huggingFaceService.ts  # Hugging Face API integration
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── utils/
│   │   └── stats.ts           # Statistics tracking
│   └── index.ts               # Application entry point
├── .env.example               # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "services": {
    "huggingFaceApi": "operational"
  }
}
```

### GET /api/stats
Usage statistics.

**Response:**
```json
{
  "totalRequests": 150,
  "averageConfidence": 0.9234,
  "positiveCount": 98,
  "negativeCount": 52,
  "uptime": 86400
}
```

### POST /api/analyze
Analyze sentiment of text.

**Request:**
```json
{
  "text": "I love this product! It's amazing."
}
```

**Response:**
```json
{
  "label": "POSITIVE",
  "score": 0.999,
  "text": "I love this product! It's amazing.",
  "analyzedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (400):**
```json
{
  "error": "Validation Error",
  "message": ["Text must be between 1 and 500 characters"],
  "statusCode": 400
}
```

## Setup

### Prerequisites

- Node.js 18+
- Hugging Face API key (free at https://huggingface.co/settings/tokens)

### Installation

1. Clone the repository
2. Navigate to backend directory:
   ```bash
   cd sentiment-analyzer-backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   ```

5. Edit `.env` and add your Hugging Face API key:
   ```
   HUGGINGFACE_API_KEY=hf_your_actual_api_key
   ```

### Running Locally

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

Server runs on http://localhost:3001

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `HUGGINGFACE_API_KEY` | Hugging Face API token | Required |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `CORS_ORIGINS` | Allowed CORS origins | http://localhost:3000 |

## Testing

### Manual Testing

Using curl:
```bash
# Health check
curl http://localhost:3001/api/health

# Analyze sentiment
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "This is great!"}'
```

## Deployment

### Render (Recommended)

1. Create new Web Service on Render
2. Connect your repository
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables:
   - `HUGGINGFACE_API_KEY`: Your API key
   - `NODE_ENV`: production
   - `CORS_ORIGINS`: Your frontend URL

## License

MIT
