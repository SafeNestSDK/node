# Verification Demo

A minimal web interface to test Tuteliq age and identity verification using the Node SDK.

## Quick Start

```bash
npm install
npm start
```

Then open [http://localhost:3456](http://localhost:3456), paste your API key in the UI, and start a verification session.

## How It Works

1. Enter your Tuteliq API key in the browser (stored in `sessionStorage`, never persisted to disk)
2. Select a verification mode (Age or Identity) and optionally a document type
3. Click **Start Verification** — the SDK creates a session and returns a URL
4. The verification URL is rendered in an iframe where the user completes the flow
5. The demo auto-polls the session status every 5 seconds until it completes

## Files

| File | Description |
|------|-------------|
| `server.js` | Node.js server that proxies requests to the Tuteliq API via the SDK |
| `index.html` | Single-page UI with session management and result display |

## Security

- The API key is sent from the browser to `localhost` only via the `X-API-Key` header
- The key is stored in `sessionStorage` (cleared when the browser tab closes)
- No credentials are written to disk or logged
