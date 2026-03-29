/**
 * Root Layout - Next.js App Router
 *
 * KEY CONCEPTS:
 * - Server Component: Default in App Router
 * - HTML structure: Root document setup
 * - Metadata API: Type-safe metadata configuration
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ToastProvider } from '@/components/ui/use-toast';

// Font configuration
// KEY CONCEPT: next/font automatically optimizes fonts
const inter = Inter({ subsets: ['latin'] });

// Viewport configuration for mobile responsiveness
// KEY CONCEPT: Essential for proper scaling on mobile devices
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// Root metadata for the application
// KEY CONCEPT: Metadata API for SEO and social sharing
export const metadata: Metadata = {
  title: 'Sentiment Analyzer',
  description: 'Analyze sentiment of text using AI',
  keywords: ['sentiment analysis', 'AI', 'machine learning', 'NLP'],
  authors: [{ name: 'Sentiment Analyzer Team' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Sentiment Analyzer',
    description: 'Analyze sentiment of text using AI',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Toast provider wrapper */}
        <ToastProvider>
          <Toaster />
          {/* Page content */}
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
