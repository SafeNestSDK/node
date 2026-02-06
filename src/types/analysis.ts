import { ContextInput } from './safety.js';
import { EmotionTrend } from '../constants.js';
import { TrackingFields } from './index.js';

// Re-export enum for convenience
export { EmotionTrend };

// =============================================================================
// Emotion Summary
// =============================================================================

export interface EmotionMessage {
    /** Sender identifier or role */
    sender: string;
    /** Message content */
    content: string;
    /** Optional timestamp */
    timestamp?: string | Date;
}

export interface AnalyzeEmotionsInput extends TrackingFields {
    /** Single content string or message history to analyze */
    content?: string;
    /** Chat history to analyze (alternative to content) */
    messages?: EmotionMessage[];
    /** Context for better analysis */
    context?: ContextInput;
}

export interface EmotionsResult {
    /** Primary emotions detected */
    dominant_emotions: string[];
    /** Scores for each detected emotion (0-1) */
    emotion_scores: Record<string, number>;
    /** Overall emotional trend */
    trend: EmotionTrend;
    /** Summary of the emotional analysis */
    summary: string;
    /** Recommended follow-up action */
    recommended_followup: string;
    /** Echo of provided external_id (if any) */
    external_id?: string;
    /** Echo of provided metadata (if any) */
    metadata?: Record<string, unknown>;
}

// Legacy type aliases for backwards compatibility
export type EmotionSummaryRequest = AnalyzeEmotionsInput;
export type EmotionSummaryResponse = EmotionsResult;
