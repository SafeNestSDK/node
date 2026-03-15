# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0] - 2026-03-15

### Added

- **`country` context field** — Pass ISO 3166-1 alpha-2 country code (e.g., `"GB"`, `"US"`, `"SE"`) in the `context` object to receive geo-localised crisis helpline data in detection responses. Falls back to user profile country if omitted.

### Improved

- **Action escalation for minors** — All detection endpoints now enforce minimum `flag_for_review` when harm is detected and the subject is a minor. Criminal indicators (sextortion, trafficking, CSAM) targeting minors automatically escalate to `immediate_intervention`.
- **Risk score distribution** — Detection prompts now instruct the LLM to use graduated scoring across the full 0.0–1.0 range instead of clustering around a single value.
- **Evidence tactic format** — Evidence tactic fields are now normalised to SCREAMING_SNAKE_CASE (e.g., `"EMOTIONAL_MANIPULATION"` instead of `"Emotional Manipulation"`).

## [1.0.0] - 2024-02-05

### Added

- Initial release of the Tuteliq TypeScript SDK
- **Safety Detection**
  - `detectBullying()` - Detect bullying and harassment in text
  - `detectGrooming()` - Analyze conversations for grooming patterns
  - `detectUnsafe()` - Identify unsafe content (self-harm, violence, hate speech)
  - `analyze()` - Quick combined analysis with risk assessment
- **Emotional Analysis**
  - `analyzeEmotions()` - Summarize emotional signals in content
- **Guidance & Reports**
  - `getActionPlan()` - Generate age-appropriate action guidance
  - `generateReport()` - Create incident reports for professional review
- **Policy Management**
  - `getPolicy()` - Retrieve current safety policy configuration
  - `setPolicy()` - Update safety thresholds and rules
- **Features**
  - Full TypeScript support with comprehensive type definitions
  - Automatic retry with exponential backoff and jitter
  - Usage tracking via response headers
  - Typed error classes for different failure scenarios
  - Input validation for content length and message counts
  - Zero runtime dependencies (uses native `fetch`)

### Security

- API endpoint locked to official Tuteliq server
- API key validation (minimum length, type checking)
- Configuration bounds validation (timeout, retries)
- No sensitive data exposed in error messages

---

## [1.1.0] - 2026-02-10

### Added
- `customer_id` tracking field for multi-tenant / B2B2C scenarios
  - Available on all detection methods (`detectBullying`, `detectGrooming`, `detectUnsafe`, `analyze`, `analyzeEmotions`, `getActionPlan`, `generateReport`)
  - Echoed back in API response for easy correlation
  - Included in webhook payloads for routing alerts to the correct customer
  - Maximum 255 characters

## [Unreleased]

### Added
- `deleteAccountData()` — Delete all account data (GDPR Article 17 — Right to Erasure)
- `exportAccountData()` — Export all account data as JSON (GDPR Article 20 — Right to Data Portability)
- `AccountDeletionResult` and `AccountExportResult` types

### Changed
- PII redaction is now **enabled by default** on the API (opt-out instead of opt-in)
