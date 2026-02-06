# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-02-05

### Added

- Initial release of the SafeNest TypeScript SDK
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

- API endpoint locked to official SafeNest server
- API key validation (minimum length, type checking)
- Configuration bounds validation (timeout, retries)
- No sensitive data exposed in error messages

---

## [Unreleased]

### Added
- Nothing yet

### Changed
- Nothing yet

### Fixed
- Nothing yet

### Security
- Nothing yet
