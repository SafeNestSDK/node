import { WebhookEventType } from '../constants.js';

// Re-export for convenience
export { WebhookEventType };

// =============================================================================
// Webhook Types
// =============================================================================

/** A webhook configuration. */
export interface Webhook {
    /** Webhook ID */
    id: string;
    /** Webhook name */
    name: string;
    /** Webhook URL (HTTPS) */
    url: string;
    /** Subscribed event types */
    events: string[];
    /** Whether the webhook is active */
    is_active: boolean;
    /** Consecutive delivery failure count */
    failure_count: number;
    /** Last time the webhook was triggered (ISO timestamp) */
    last_triggered_at?: string;
    /** Last delivery error message */
    last_error?: string;
    /** Creation timestamp (ISO) */
    created_at: string;
    /** Last update timestamp (ISO) */
    updated_at: string;
}

/** Result from listing webhooks. */
export interface WebhookListResult {
    /** Array of webhook configurations */
    webhooks: Webhook[];
}

/** Input for creating a new webhook. */
export interface CreateWebhookInput {
    /** Webhook name (max 100 characters) */
    name: string;
    /** Webhook URL (must be HTTPS) */
    url: string;
    /** Event types to subscribe to (1-5 events) */
    events: WebhookEventType[];
    /** Optional custom headers to send with webhook payloads */
    headers?: Record<string, string>;
}

/** Result from creating a webhook (includes signing secret). */
export interface CreateWebhookResult {
    /** Webhook ID */
    id: string;
    /** Webhook name */
    name: string;
    /** Webhook URL */
    url: string;
    /** Signing secret — only returned on creation, store it securely */
    secret: string;
    /** Subscribed event types */
    events: string[];
    /** Whether the webhook is active */
    is_active: boolean;
    /** Creation timestamp (ISO) */
    created_at: string;
}

/** Input for updating a webhook (only non-undefined fields are sent). */
export interface UpdateWebhookInput {
    /** New name */
    name?: string;
    /** New URL */
    url?: string;
    /** New event subscriptions */
    events?: WebhookEventType[];
    /** Enable or disable the webhook */
    isActive?: boolean;
    /** Custom headers */
    headers?: Record<string, string>;
}

/** Result from updating a webhook. */
export interface UpdateWebhookResult {
    /** Webhook ID */
    id: string;
    /** Webhook name */
    name: string;
    /** Webhook URL */
    url: string;
    /** Subscribed event types */
    events: string[];
    /** Whether the webhook is active */
    is_active: boolean;
    /** Last update timestamp (ISO) */
    updated_at: string;
}

/** Result from deleting a webhook. */
export interface DeleteWebhookResult {
    /** Whether the deletion was successful */
    success: boolean;
    /** Confirmation message */
    message: string;
}

/** Result from testing a webhook. */
export interface TestWebhookResult {
    /** Whether the test payload was delivered */
    success: boolean;
    /** HTTP status code from the webhook endpoint */
    status_code: number;
    /** Round-trip latency in milliseconds */
    latency_ms: number;
    /** Error message if delivery failed */
    error?: string;
}

/** Result from regenerating a webhook secret. */
export interface RegenerateSecretResult {
    /** The new signing secret */
    secret: string;
}
