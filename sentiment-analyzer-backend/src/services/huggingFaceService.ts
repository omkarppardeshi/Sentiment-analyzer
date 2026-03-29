/**
 * Hugging Face Service
 *
 * Handles communication with Hugging Face Inference API (router-based).
 */

import type { AnalyzeResponse } from '../types/index.js';
import { ApiError } from '../types/index.js';

// Model identifier
const MODEL_NAME = 'cardiffnlp/twitter-roberta-base-sentiment-latest';

// ✅ Correct NEW router endpoint
const HF_API_URL = 'https://router.huggingface.co/hf-inference/models';

/**
 * Analyze sentiment of input text
 */
export async function analyzeSentiment(text: string): Promise<AnalyzeResponse> {
  try {
    // Validate input
    if (!text || text.trim().length === 0) {
      throw new ApiError('Text cannot be empty', 400);
    }

    if (text.length > 500) {
      throw new ApiError('Text exceeds maximum length of 500 characters', 400);
    }

    const response = await fetch(`${HF_API_URL}/${MODEL_NAME}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        options: {
          wait_for_model: true,
          use_cache: false,
        },
      }),
    });

    // ✅ Handle model loading
    if (response.status === 503) {
      await new Promise((res) => setTimeout(res, 2000));
      return analyzeSentiment(text);
    }

    if (!response.ok) {
      const errorData = (await response.json()) as { error?: string };
      throw new ApiError(
        `Hugging Face API error: ${response.status} - ${
          errorData.error || response.statusText
        }`,
        response.status
      );
    }

    /**
     * Hugging Face returns:
     * [
     *   [
     *     { label: "negative", score: 0.54 },
     *     { label: "neutral", score: 0.41 },
     *     { label: "positive", score: 0.05 }
     *   ]
     * ]
     */
    const result = (await response.json()) as Array<Array<{ label: string; score: number }>>;

    const predictions = result[0];

    if (!Array.isArray(predictions) || predictions.length === 0) {
      throw new ApiError('Invalid response from Hugging Face API', 500);
    }

    // ✅ Get highest score
    const best = predictions.reduce((prev: any, curr: any) =>
      curr.score > prev.score ? curr : prev
    );

    // ✅ Labels are already lowercase: "negative", "neutral", "positive"
    const label = best.label.toUpperCase() as 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE';

    return {
      label,
      score: best.score,
      text: text.trim(),
      analyzedAt: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new ApiError('Unable to connect to Hugging Face API', 503);
      }
      throw new ApiError(`Analysis failed: ${error.message}`, 500);
    }

    throw new ApiError('An unexpected error occurred during analysis', 500);
  }
}

/**
 * API health check
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${HF_API_URL}/${MODEL_NAME}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: 'test',
        options: {
          wait_for_model: true,
        },
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}
