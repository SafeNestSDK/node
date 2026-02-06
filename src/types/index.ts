// Re-export all types
export * from './safety.js';
export * from './analysis.js';
export * from './guidance.js';
export * from './reports.js';
export * from './policy.js';

// =============================================================================
// Common Types
// =============================================================================

/**
 * Tracking fields for correlating requests with your systems
 */
export interface TrackingFields {
    /**
     * Your unique identifier for this request (e.g., message ID, user ID, session ID)
     * Maximum 255 characters. Echoed back in response and included in webhooks.
     */
    external_id?: string;
    /**
     * Custom key-value pairs for additional context
     * Stored with detection results and included in webhooks.
     */
    metadata?: Record<string, unknown>;
}

export interface ApiError {
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}

export interface SafeNestOptions {
    /** Request timeout in milliseconds (defaults to 30000) */
    timeout?: number;
    /** Number of retry attempts (defaults to 3) */
    retries?: number;
    /** Initial retry delay in milliseconds (defaults to 1000) */
    retryDelay?: number;
}

export interface Usage {
    /** Total message limit */
    limit: number;
    /** Messages used */
    used: number;
    /** Messages remaining */
    remaining: number;
}

export interface RequestMeta {
    /** Request correlation ID */
    requestId: string;
    /** Request latency in milliseconds */
    latencyMs: number;
    /** Current usage stats */
    usage?: Usage;
}

// Legacy type alias for backwards compatibility
export interface SafeNestClientOptions extends SafeNestOptions {
    apiKey: string;
}
