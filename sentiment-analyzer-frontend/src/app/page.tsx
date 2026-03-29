/**
 * Home Page - Sentiment Analyzer
 *
 * KEY CONCEPTS:
 * - Client Component: 'use client' directive for interactivity
 * - React hooks: useState, useEffect for state management
 * - Custom hooks: useSentimentAnalysis, useHistory
 * - Component composition: Building UI from smaller pieces
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { SentimentChart } from '@/components/SentimentChart';
import { useToastContext } from '@/components/ui/use-toast';
import { useSentimentAnalysis } from '@/hooks/useSentimentAnalysis';
import { useHistory } from '@/hooks/useHistory';
import {
  getConfidencePercent,
  getSentimentColor,
  formatDate,
} from '@/lib/utils';
import { Loader2, Sparkles, Trash2, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';

// Example texts for demonstration
const EXAMPLE_TEXTS = [
  'I absolutely love this product! It exceeded all my expectations.',
  'This is the worst experience I have ever had. Completely disappointed.',
  'The service was okay, nothing special but not bad either.',
  'Amazing! Best purchase I have made in years.',
  'Terrible quality. Would not recommend to anyone.',
];

/**
 * HomePage Component
 */
export default function HomePage() {
  // Text input state
  const [text, setText] = useState('');

  // Custom hooks for analysis and history
  const { state, analyze, reset } = useSentimentAnalysis();
  const { history, isLoaded, clearHistory, refreshHistory } = useHistory();
  const toast = useToastContext();

  // Refresh history when state changes (new analysis completed)
  useEffect(() => {
    if (state.status === 'success') {
      refreshHistory();
    }
  }, [state.status, refreshHistory]);

  // Handle form submission
  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }
    await analyze(text);
  };

  // Handle example text click
  const handleExampleClick = (exampleText: string) => {
    setText(exampleText);
    toast.info('Try this example text!');
  };

  // Handle clear history
  const handleClearHistory = () => {
    clearHistory();
    toast.success('History cleared');
  };

  // Calculate stats from history
  const totalAnalyses = history.length;
  const positiveCount = history.filter((h) => h.label === 'POSITIVE').length;
  const negativeCount = history.filter((h) => h.label === 'NEGATIVE').length;

  // Character count validation
  const charCount = text.length;
  const isOverLimit = charCount > 500;
  const remainingChars = 500 - charCount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl px-4 py-4 sm:py-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/logo.png" alt="Logo" className="h-12 w-12 sm:h-16 sm:w-16" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Sentiment Analyzer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Powered by AI - Analyze the emotional tone of any text
          </p>
        </header>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Left Column - Input and Results */}
          <div className="space-y-4 sm:space-y-6">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Analyze Text
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Enter up to 500 characters of text to analyze its sentiment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Textarea with character count */}
                <div className="relative">
                  <Textarea
                    placeholder="Type or paste your text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={`min-h-[120px] sm:min-h-[150px] ${isOverLimit ? 'border-destructive' : ''}`}
                    disabled={state.status === 'loading'}
                  />
                  {/* Character counter */}
                  <div
                    className={`absolute bottom-2 right-2 text-xs ${isOverLimit ? 'text-destructive font-medium' : 'text-muted-foreground'}`}
                  >
                    {remainingChars}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleAnalyze}
                    disabled={state.status === 'loading' || !text.trim() || isOverLimit}
                    className="flex-1 text-sm"
                  >
                    {state.status === 'loading' ? (
                      <>
                        <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                        <span className="hidden sm:inline">Analyzing...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Analyze</span>
                      </>
                    )}
                  </Button>
                  {state.status !== 'idle' && (
                    <Button variant="outline" size="sm" onClick={reset}>
                      Clear
                    </Button>
                  )}
                </div>

                {/* Example texts */}
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">Try an example:</p>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLE_TEXTS.slice(0, 3).map((example, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary text-xs"
                        onClick={() => handleExampleClick(example)}
                      >
                        {i + 1}. {example.slice(0, 20)}...
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            {state.status === 'success' && state.data && (
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>Result</span>
                    <Badge
                      variant={state.data.label === 'POSITIVE' ? 'positive' : 'negative'}
                      className="text-xs"
                    >
                      {state.data.label === 'POSITIVE' ? (
                        <ThumbsUp className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                        <ThumbsDown className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                      {state.data.label}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Confidence score */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-medium">
                        {getConfidencePercent(state.data.score)}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full transition-all ${state.data.label === 'POSITIVE' ? 'bg-positive' : 'bg-negative'}`}
                        style={{ width: getConfidencePercent(state.data.score) }}
                      />
                    </div>
                  </div>

                  {/* Analyzed text */}
                  <div className="rounded-lg bg-muted/50 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Original text:</p>
                    <p className="text-xs sm:text-sm">{state.data.text}</p>
                  </div>

                  {/* Timestamp */}
                  <p className="text-xs text-muted-foreground">
                    {formatDate(state.data.analyzedAt)}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {state.status === 'error' && (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Analysis Failed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-destructive">{state.error}</p>
                  <Button
                    variant="outline"
                    onClick={reset}
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - History and Stats */}
          <div className="space-y-4 sm:space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribution</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Sentiment distribution from your analysis history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[140px] sm:h-[180px] flex items-center justify-center">
                  <SentimentChart
                    positiveCount={positiveCount}
                    negativeCount={negativeCount}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-positive">{positiveCount}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Positive</p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-negative">{negativeCount}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Negative</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* History Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">History</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Last {history.length} analyses
                  </CardDescription>
                </div>
                {history.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearHistory}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {!isLoaded ? (
                  // Loading skeleton
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 w-full skeleton rounded-md" />
                    ))}
                  </div>
                ) : history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                    <p className="text-muted-foreground text-sm">No analysis history yet</p>
                  </div>
                ) : (
                  // History list
                  <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                    {history
                      .slice()
                      .reverse()
                      .map((item) => {
                        const colors = getSentimentColor(item.label);
                        return (
                          <div
                            key={item.id}
                            className={`rounded-lg border p-2 sm:p-3 ${colors.border} ${colors.bg}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm truncate">{item.text}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDate(item.analyzedAt)}
                                </p>
                              </div>
                              <div className="flex flex-col items-end">
                                <Badge
                                  variant={item.label === 'POSITIVE' ? 'positive' : 'negative'}
                                  className="text-xs"
                                >
                                  {item.label}
                                </Badge>
                                <span className={`text-xs font-medium mt-1 ${colors.text}`}>
                                  {getConfidencePercent(item.score)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            Built with Next.js, TypeScript, and Hugging Face Inference API
          </p>
        </footer>
      </div>
    </div>
  );
}
