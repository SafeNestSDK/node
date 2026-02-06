/**
 * Base error class for SafeNest SDK errors
 */
export class SafeNestError extends Error {
    constructor(
        message: string,
        public readonly statusCode?: number,
        public readonly details?: unknown
    ) {
        super(message);
        this.name = 'SafeNestError';
        Object.setPrototypeOf(this, SafeNestError.prototype);
    }
}

/**
 * Error thrown when authentication fails (401)
 */
export class AuthenticationError extends SafeNestError {
    constructor(message = 'Authentication failed. Please check your API key.') {
        super(message, 401);
        this.name = 'AuthenticationError';
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

/**
 * Error thrown when rate limit is exceeded (429)
 */
export class RateLimitError extends SafeNestError {
    constructor(
        message = 'Rate limit exceeded. Please try again later.',
        public readonly retryAfter?: number
    ) {
        super(message, 429);
        this.name = 'RateLimitError';
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}

/**
 * Error thrown when request validation fails (400)
 */
export class ValidationError extends SafeNestError {
    constructor(message: string, details?: unknown) {
        super(message, 400, details);
        this.name = 'ValidationError';
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * Error thrown when a resource is not found (404)
 */
export class NotFoundError extends SafeNestError {
    constructor(message = 'Resource not found') {
        super(message, 404);
        this.name = 'NotFoundError';
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

/**
 * Error thrown when the server returns an error (5xx)
 */
export class ServerError extends SafeNestError {
    constructor(message = 'Server error. Please try again later.', statusCode = 500) {
        super(message, statusCode);
        this.name = 'ServerError';
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}

/**
 * Error thrown when a request times out
 */
export class TimeoutError extends SafeNestError {
    constructor(message = 'Request timed out') {
        super(message);
        this.name = 'TimeoutError';
        Object.setPrototypeOf(this, TimeoutError.prototype);
    }
}

/**
 * Error thrown when network connectivity fails
 */
export class NetworkError extends SafeNestError {
    constructor(message = 'Network error. Please check your connection.') {
        super(message);
        this.name = 'NetworkError';
        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}
