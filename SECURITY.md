# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously at Tuteliq. If you discover a security vulnerability in this SDK, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please send an email to:

📧 **security@tuteliq.ai**

Include the following information:

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** of the vulnerability
4. **Suggested fix** (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours of your report
- **Initial assessment**: Within 5 business days
- **Resolution timeline**: Depends on severity, typically within 30 days
- **Credit**: We'll credit you in the security advisory (unless you prefer anonymity)

### Severity Levels

| Severity | Description | Response Time |
|----------|-------------|---------------|
| Critical | Data breach, RCE, auth bypass | 24 hours |
| High | Significant security impact | 72 hours |
| Medium | Limited security impact | 1 week |
| Low | Minimal security impact | 30 days |

## Security Best Practices

When using the Tuteliq SDK:

### API Key Protection

```typescript
// ✅ Good - Use environment variables
const tuteliq = new Tuteliq(process.env.TUTELIQ_API_KEY)

// ❌ Bad - Never hardcode API keys
const tuteliq = new Tuteliq('sk_live_abc123...')
```

### Server-Side Usage

```typescript
// ✅ Good - Use SDK on the server
// API route handler
app.post('/analyze', async (req, res) => {
  const result = await tuteliq.analyze(req.body.content)
  res.json(result)
})

// ❌ Bad - Never expose API key in client-side code
// This exposes your API key to all users!
```

### Input Validation

The SDK validates inputs, but always sanitize user content:

```typescript
// ✅ Good - Sanitize before sending
const sanitized = sanitizeInput(userContent)
const result = await tuteliq.analyze(sanitized)
```

## Security Features

This SDK includes several security measures:

1. **Locked API endpoint** - Cannot be redirected to malicious servers
2. **Input validation** - Content length and message count limits
3. **API key validation** - Minimum length and type checks
4. **Timeout protection** - Prevents hanging requests
5. **No secrets in errors** - Error messages don't leak sensitive data

## Acknowledgments

We thank the following security researchers for responsibly disclosing vulnerabilities:

*No vulnerabilities reported yet.*

---

Tuteliq AB
Stockholm, Sweden
[tuteliq.ai](https://tuteliq.ai)
