/**
 * Verification Types
 *
 * Session-based age and identity verification.
 * The SDK creates a verification session and receives a URL to render in a web view.
 * The web UI handles all document capture, liveness checks, and submission.
 * The SDK then polls or retrieves the verification result.
 */

import {
    VerificationMode,
    DocumentType,
    VerificationStatus,
    VerificationSessionStatus,
} from '../constants.js';

// =============================================================================
// Input Types
// =============================================================================

export interface CreateVerificationSessionInput {
    /** Type of verification to perform */
    mode: VerificationMode;
    /** Preferred document type (optional hint for the web UI) */
    document_type?: DocumentType;
    /** URL to redirect the user after verification completes (optional) */
    redirect_url?: string;
    /** Your external reference ID for this verification */
    external_id?: string;
    /** Your end-customer identifier */
    customer_id?: string;
    /** Custom key-value metadata */
    metadata?: Record<string, unknown>;
}

// =============================================================================
// Session Types
// =============================================================================

export interface VerificationSession {
    /** Unique session identifier */
    session_id: string;
    /** URL to open in a new tab or web view for the user to complete verification */
    url: string;
    /** ISO timestamp when the session expires */
    expires_at: string;
    /** Verification mode */
    mode: VerificationMode;
}

export interface VerificationSessionResult {
    /** Unique session identifier */
    session_id: string;
    /** Current session status */
    status: VerificationSessionStatus;
    /** Verification mode */
    mode?: VerificationMode;
    /** Verification result (present when status is 'completed') */
    result?: AgeVerificationResult | IdentityVerificationResult;
    /** ISO timestamp when the session was created */
    created_at?: string;
    /** ISO timestamp when the session expires */
    expires_at?: string;
}

// =============================================================================
// Verification Result Types
// =============================================================================

export interface FaceMatchResult {
    /** Whether ID face matches selfie */
    matched: boolean;
    /** Euclidean distance between face descriptors (lower = more similar) */
    distance: number;
    /** Confidence score (0-1, higher = more confident) */
    confidence: number;
}

export interface LivenessResult {
    /** Whether liveness check passed */
    valid: boolean;
    /** Reason for failure (if not valid) */
    reason?: string;
}

export interface AgeVerificationResult {
    /** Unique verification ID for retrieval */
    verification_id: string;
    /** Overall verification status */
    status: VerificationStatus;
    /** Estimated age bracket (e.g. "18-25", "under_18") */
    age_bracket?: string;
    /** Whether the person is under 18 (null if age unknown) */
    is_minor: boolean | null;
    /** Face comparison results (null if faces not detected) */
    face_match: FaceMatchResult | null;
    /** Liveness check results */
    liveness: LivenessResult;
    /** Reasons for any failures (empty array if fully verified) */
    failure_reasons: string[];
    /** Number of credits consumed */
    credits_used: number;
}

export interface IdentityVerificationResult {
    /** Unique verification ID for retrieval */
    verification_id: string;
    /** Overall verification status */
    status: VerificationStatus;
    /** Full name extracted from document */
    full_name?: string;
    /** Date of birth in YYYY-MM-DD format */
    date_of_birth?: string;
    /** Document type used */
    document_type?: string;
    /** ISO 3166-1 alpha-2 country code */
    country_code?: string;
    /** Face comparison results (null if faces not detected) */
    face_match: FaceMatchResult | null;
    /** Liveness check results */
    liveness: LivenessResult;
    /** Reasons for any failures (empty array if fully verified) */
    failure_reasons: string[];
    /** Number of credits consumed */
    credits_used: number;
}

export interface VerificationRetrieveResult {
    /** Unique verification ID */
    verification_id: string;
    /** Verification status */
    status: VerificationStatus;
    /** Calculated age (null if not determined) */
    age: number | null;
    /** Whether the person is under 18 (null if unknown) */
    is_minor: boolean | null;
    /** Whether face matched */
    face_matched: boolean | null;
    /** Face match confidence */
    face_confidence: number | null;
    /** Whether liveness check passed */
    liveness_valid: boolean;
    /** Reasons for failure */
    failure_reasons: string[];
    /** ISO timestamp of verification */
    created_at: string;
}

export interface IdentityRetrieveResult {
    /** Unique verification ID */
    verification_id: string;
    /** Verification status */
    status: VerificationStatus;
    /** Full name extracted from document */
    full_name?: string;
    /** Date of birth in YYYY-MM-DD format */
    date_of_birth?: string;
    /** Document type used */
    document_type?: string;
    /** ISO 3166-1 alpha-2 country code */
    country_code?: string;
    /** Whether face matched */
    face_matched: boolean | null;
    /** Face match confidence */
    face_confidence: number | null;
    /** Whether liveness check passed */
    liveness_valid: boolean;
    /** Reasons for failure */
    failure_reasons: string[];
    /** ISO timestamp of verification */
    created_at: string;
}
