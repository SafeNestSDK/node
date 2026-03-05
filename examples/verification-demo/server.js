import http from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
    Tuteliq,
    VerificationMode,
    DocumentType,
} from '@tuteliq/sdk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3456;

// ── Helpers ─────────────────────────────────────────────────────────────────
function json(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch {
                reject(new Error('Invalid JSON'));
            }
        });
    });
}

/**
 * Create a Tuteliq client from the API key sent in the X-API-Key header.
 * Throws a clear error if the header is missing.
 */
function clientFromRequest(req) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        const err = new Error('API key is required. Enter your key in the UI.');
        err.statusCode = 401;
        throw err;
    }
    return new Tuteliq(apiKey);
}

// ── Routes ──────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
    try {
        // Serve the HTML page
        if (req.method === 'GET' && req.url === '/') {
            const html = readFileSync(join(__dirname, 'index.html'), 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            return res.end(html);
        }

        // POST /api/session — create verification session
        if (req.method === 'POST' && req.url === '/api/session') {
            const tuteliq = clientFromRequest(req);
            const body = await parseBody(req);

            const mode = body.mode === 'identity'
                ? VerificationMode.IDENTITY
                : VerificationMode.AGE;

            const input = { mode };
            if (body.document_type) {
                const docTypes = {
                    passport: DocumentType.PASSPORT,
                    id_card: DocumentType.ID_CARD,
                    drivers_license: DocumentType.DRIVERS_LICENSE,
                };
                input.document_type = docTypes[body.document_type] || undefined;
            }
            if (body.redirect_url) input.redirect_url = body.redirect_url;

            const session = await tuteliq.createVerificationSession(input);
            return json(res, 200, session);
        }

        // GET /api/session/:id — poll session status
        if (req.method === 'GET' && req.url.startsWith('/api/session/')) {
            const tuteliq = clientFromRequest(req);
            const sessionId = req.url.replace('/api/session/', '');
            const result = await tuteliq.getVerificationSession(sessionId);
            return json(res, 200, result);
        }

        // DELETE /api/session/:id — cancel session
        if (req.method === 'DELETE' && req.url.startsWith('/api/session/')) {
            const tuteliq = clientFromRequest(req);
            const sessionId = req.url.replace('/api/session/', '');
            await tuteliq.cancelVerificationSession(sessionId);
            return json(res, 200, { cancelled: true });
        }

        // GET /api/verification/age/:id — retrieve past age verification
        if (req.method === 'GET' && req.url.startsWith('/api/verification/age/')) {
            const tuteliq = clientFromRequest(req);
            const id = req.url.replace('/api/verification/age/', '');
            const result = await tuteliq.getAgeVerification(id);
            return json(res, 200, result);
        }

        // GET /api/verification/identity/:id — retrieve past identity verification
        if (req.method === 'GET' && req.url.startsWith('/api/verification/identity/')) {
            const tuteliq = clientFromRequest(req);
            const id = req.url.replace('/api/verification/identity/', '');
            const result = await tuteliq.getIdentityVerification(id);
            return json(res, 200, result);
        }

        json(res, 404, { error: 'Not found' });
    } catch (err) {
        console.error('Error:', err.message);
        json(res, err.statusCode || 500, {
            error: err.message,
            code: err.code,
        });
    }
});

server.listen(PORT, () => {
    console.log(`\n  Verification demo running at http://localhost:${PORT}\n`);
});
