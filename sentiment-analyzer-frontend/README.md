# Sentiment Analyzer Frontend

A production-ready Next.js 14 application for sentiment analysis with TypeScript.

## Features

- **Next.js 14 App Router**: Modern React Server Components and routing
- **TypeScript**: Full type safety with strict mode
- **shadcn/ui Components**: Beautiful, accessible UI components
- **Recharts**: Interactive data visualization
- **LocalStorage History**: Persist last 10 analyses
- **Dark Mode Support**: CSS-based dark mode
- **Responsive Design**: Mobile-first approach

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
sentiment-analyzer-frontend/
├── src/
│   ├── app/
│   │   ├── globals.css        # Global styles and Tailwind
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   └── use-toast.ts
│   │   └── SentimentChart.tsx # Chart component
│   ├── hooks/
│   │   ├── useSentimentAnalysis.ts
│   │   └── useHistory.ts
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   └── utils.ts           # Utility functions
│   └── types/
│       └── index.ts           # TypeScript types
├── public/
├── .env.local.example
├── package.json
├── tailwind.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running (see `/sentiment-analyzer-backend`)

### Installation

1. Navigate to frontend directory:
   ```bash
   cd sentiment-analyzer-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:3001/api |

## Features

### Sentiment Analysis
- Enter text up to 500 characters
- Real-time character count
- Loading states and error handling
- Confidence score visualization

### Analysis History
- Stores last 10 analyses in localStorage
- Clear history option
- Sentiment distribution chart

### Example Texts
- Pre-loaded examples to try
- Quick-fill functionality

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on Vercel
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL
4. Deploy!

### Manual Build

```bash
npm run build
npm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

## License

MIT
