import { RateLimitError, ServerError, NetworkError, TimeoutError } from '../errors.js';

export interface RetryOptions {
    /** Maximum number of retry attempts */
    maxRetries: number;
    /** Initial delay in milliseconds */
    initialDelay: number;
    /** Maximum delay in milliseconds */
    maxDelay?: number;
    /** Multiplier for exponential backoff */
    backoffMultiplier?: number;
    /** Function to determine if an error is retryable */
    isRetryable?: (error: unknown) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    isRetryable: defaultIsRetryable,
};

function defaultIsRetryable(error: unknown): boolean {
    // Retry on rate limit, server errors, network errors, and timeouts
    if (error instanceof RateLimitError) return true;
    if (error instanceof ServerError) return true;
    if (error instanceof NetworkError) return true;
    if (error instanceof TimeoutError) return true;

    // Retry on fetch errors (network issues)
    if (error instanceof TypeError && error.message.includes('fetch')) return true;

    return false;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateDelay(attempt: number, options: Required<RetryOptions>): number {
    const delay = options.initialDelay * Math.pow(options.backoffMultiplier, attempt);
    // Add jitter (0-25% of delay)
    const jitter = delay * Math.random() * 0.25;
    return Math.min(delay + jitter, options.maxDelay);
}

/**
 * Execute a function with exponential backoff retry
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    options: Partial<RetryOptions> = {}
): Promise<T> {
    const opts: Required<RetryOptions> = { ...DEFAULT_OPTIONS, ...options };

    let lastError: unknown;

    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Check if we should retry
            if (attempt >= opts.maxRetries || !opts.isRetryable(error)) {
                throw error;
            }

            // Handle rate limit with retry-after header
            if (error instanceof RateLimitError && error.retryAfter) {
                await sleep(error.retryAfter * 1000);
            } else {
                const delay = calculateDelay(attempt, opts);
                await sleep(delay);
            }
        }
    }

    throw lastError;
}
