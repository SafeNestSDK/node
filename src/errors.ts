/**
 * Additional error metadata from the API
 */
export interface ErrorMeta {
    /** Error code from the API (e.g., "RATE_LIMIT_EXCEEDED") */
    code?: string;
    /** Suggested action to resolve the error */
    suggestion?: string;
    /** Helpful links (e.g., { upgrade: "https://tuteliq.ai/pricing" }) */
    links?: Record<string, string>;
}

/**
 * Base error class for Tuteliq SDK errors
 */
export class TuteliqError extends Error {
    /** API error code */
    public readonly code?: string;
    /** Suggested action to resolve the error */
    public readonly suggestion?: string;
    /** Helpful links */
    public readonly links?: Record<string, string>;

    constructor(
        message: string,
        public readonly statusCode?: number,
        public readonly details?: unknown,
        meta?: ErrorMeta
    ) {
        super(message);
        this.name = 'TuteliqError';
        this.code = meta?.code;
        this.suggestion = meta?.suggestion;
        this.links = meta?.links;
        Object.setPrototypeOf(this, TuteliqError.prototype);
    }
}

/**
 * Error thrown when authentication fails (401)
 */
export class AuthenticationError extends TuteliqError {
    constructor(
        message = 'Authentication failed. Please check your API key.',
        meta?: ErrorMeta
    ) {
        super(message, 401, undefined, meta);
        this.name = 'AuthenticationError';
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

/**
 * Error thrown when rate limit is exceeded (429)
 */
export class RateLimitError extends TuteliqError {
    constructor(
        message = 'Rate limit exceeded. Please try again later.',
        public readonly retryAfter?: number,
        meta?: ErrorMeta
    ) {
        super(message, 429, undefined, meta);
        this.name = 'RateLimitError';
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}

/**
 * Error thrown when request validation fails (400)
 */
export class ValidationError extends TuteliqError {
    constructor(message: string, details?: unknown, meta?: ErrorMeta) {
        super(message, 400, details, meta);
        this.name = 'ValidationError';
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * Error thrown when a resource is not found (404)
 */
export class NotFoundError extends TuteliqError {
    constructor(message = 'Resource not found', meta?: ErrorMeta) {
        super(message, 404, undefined, meta);
        this.name = 'NotFoundError';
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

/**
 * Error thrown when the server returns an error (5xx)
 */
export class ServerError extends TuteliqError {
    constructor(
        message = 'Server error. Please try again later.',
        statusCode = 500,
        meta?: ErrorMeta
    ) {
        super(message, statusCode, undefined, meta);
        this.name = 'ServerError';
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}

/**
 * Error thrown when a request times out
 */
export class TimeoutError extends TuteliqError {
    constructor(message = 'Request timed out') {
        super(message);
        this.name = 'TimeoutError';
        Object.setPrototypeOf(this, TimeoutError.prototype);
    }
}

/**
 * Error thrown when network connectivity fails
 */
export class NetworkError extends TuteliqError {
    constructor(message = 'Network error. Please check your connection.') {
        super(message);
        this.name = 'NetworkError';
        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}

/**
 * Error thrown when monthly message limit is reached
 */
export class QuotaExceededError extends TuteliqError {
    constructor(
        message = 'Monthly message limit reached. Please upgrade your plan or purchase credits.',
        meta?: ErrorMeta
    ) {
        super(message, 429, undefined, meta);
        this.name = 'QuotaExceededError';
        Object.setPrototypeOf(this, QuotaExceededError.prototype);
    }
}

/**
 * Error thrown when trying to access a restricted endpoint
 */
export class TierAccessError extends TuteliqError {
    constructor(
        message = 'This endpoint is not available on your current plan.',
        meta?: ErrorMeta
    ) {
        super(message, 403, undefined, meta);
        this.name = 'TierAccessError';
        Object.setPrototypeOf(this, TierAccessError.prototype);
    }
}
