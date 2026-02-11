// =============================================================================
// Account Management Types (GDPR)
// =============================================================================

/**
 * Result of account data deletion (GDPR Article 17 - Right to Erasure)
 */
export interface AccountDeletionResult {
    /** Confirmation message */
    message: string;
    /** Number of records deleted */
    deleted_count: number;
}

/**
 * Exported user data (GDPR Article 20 - Right to Data Portability)
 */
export interface AccountExportResult {
    /** User ID */
    userId: string;
    /** ISO timestamp of when the export was created */
    exportedAt: string;
    /** All user data grouped by collection */
    data: Record<string, unknown[]>;
}
