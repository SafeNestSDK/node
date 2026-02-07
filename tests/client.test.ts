import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SafeNest } from '../src/client.js';
import {
    AuthenticationError,
    RateLimitError,
    ValidationError,
    ServerError,
    TimeoutError,
} from '../src/errors.js';

// Helper to create mock response
function mockFetchResponse(data: unknown, options: { ok?: boolean; status?: number; headers?: Record<string, string> } = {}) {
    const { ok = true, status = 200, headers = {} } = options;
    return {
        ok,
        status,
        json: async () => data,
        headers: {
            get: (name: string) => headers[name.toLowerCase()] || null,
        },
    } as Response;
}

const API_BASE_URL = 'https://api.safenest.dev';

describe('SafeNest', () => {
    let safenest: SafeNest;

    beforeEach(() => {
        safenest = new SafeNest('test-api-key-12345', {
            timeout: 5000,
            retries: 0, // Disable retries for tests
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('should throw error if API key is missing', () => {
            expect(() => new SafeNest('')).toThrow('API key is required');
        });

        it('should accept simple API key string', () => {
            const client = new SafeNest('my-api-key');
            expect(client).toBeInstanceOf(SafeNest);
        });

        it('should accept API key with options', () => {
            const client = new SafeNest('my-api-key', { timeout: 10000 });
            expect(client).toBeInstanceOf(SafeNest);
        });

        it('should accept options without baseUrl', () => {
            const client = new SafeNest('test-api-key-12345', { timeout: 15000 });
            expect(client).toBeInstanceOf(SafeNest);
        });

        it('should reject API key that is too short', () => {
            expect(() => new SafeNest('short')).toThrow('too short');
        });

        it('should reject invalid timeout', () => {
            expect(() => new SafeNest('valid-api-key-12345', { timeout: 500 }))
                .toThrow('Timeout must be between');
        });

        it('should reject invalid retries', () => {
            expect(() => new SafeNest('valid-api-key-12345', { retries: 15 }))
                .toThrow('Retries must be between');
        });
    });

    describe('detectBullying', () => {
        it('should make POST request with content', async () => {
            const mockResponse = {
                is_bullying: true,
                bullying_type: ['verbal_abuse'],
                confidence: 0.85,
                severity: 'medium',
                rationale: 'Test rationale',
                recommended_action: 'monitor',
                risk_score: 0.7,
            };

            vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(mockResponse));

            const result = await safenest.detectBullying({
                content: 'test message',
                context: 'chat',
            });

            expect(result).toEqual(mockResponse);
            expect(fetch).toHaveBeenCalledWith(
                `${API_BASE_URL}/api/v1/safety/bullying`,
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer test-api-key-12345',
                    }),
                })
            );
        });

        it('should normalize string context to platform', async () => {
            const mockResponse = { is_bullying: false };

            vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(mockResponse));

            await safenest.detectBullying({
                content: 'hello',
                context: 'chat',
            });

            const call = vi.mocked(fetch).mock.calls[0];
            const body = JSON.parse(call[1]?.body as string);
            expect(body.context).toEqual({ platform: 'chat' });
        });

        it('should pass object context directly', async () => {
            const mockResponse = { is_bullying: false };

            vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(mockResponse));

            await safenest.detectBullying({
                content: 'hello',
                context: { ageGroup: '11-13', relationship: 'classmates' },
            });

            const call = vi.mocked(fetch).mock.calls[0];
            const body = JSON.parse(call[1]?.body as string);
            expect(body.context).toEqual({ ageGroup: '11-13', relationship: 'classmates' });
        });
    });

    describe('detectGrooming', () => {
        it('should transform messages to API format', async () => {
            const mockResponse = {
                grooming_risk: 'high',
                confidence: 0.9,
                flags: ['secret_keeping'],
                rationale: 'Test rationale',
                risk_score: 0.85,
                recommended_action: 'immediate_review',
            };

            vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(mockResponse));

            const result = await safenest.detectGrooming({
                messages: [
                    { role: 'adult', content: 'Keep this secret' },
                    { role: 'child', content: 'Ok' },
                ],
                childAge: 12,
            });

            expect(result.grooming_risk).toBe('high');

            const call = vi.mocked(fetch).mock.calls[0];
            const body = JSON.parse(call[1]?.body as string);
            expect(body.messages[0]).toEqual({ sender_role: 'adult', text: 'Keep this secret' });
            expect(body.context.child_age).toBe(12);
        });
    });

    describe('detectUnsafe', () => {
        it('should detect unsafe content', async () => {
            const mockResponse = {
                unsafe: true,
                categories: ['self_harm'],
                severity: 'critical',
                confidence: 0.95,
                risk_score: 0.9,
                rationale: 'Test rationale',
                recommended_action: 'immediate_intervention',
            };

            vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(mockResponse));

            const result = await safenest.detectUnsafe({
                content: 'harmful content',
            });

            expect(result.unsafe).toBe(true);
            expect(result.categories).toContain('self_harm');
        });
    });

    describe('analyze', () => {
        it('should accept simple string content', async () => {
            const bullyingResponse = { is_bullying: false, risk_score: 0.1 };
            const unsafeResponse = { unsafe: false, risk_score: 0.1 };

            vi.spyOn(global, 'fetch')
                .mockResolvedValueOnce(mockFetchResponse(bullyingResponse))
                .mockResolvedValueOnce(mockFetchResponse(unsafeResponse));

            const result = await safenest.analyze('test message');

            expect(result.risk_level).toBe('safe');
            expect(result.risk_score).toBeLessThan(0.3);
        });

        it('should combine bullying and unsafe results', async () => {
            const bullyingResponse = {
                is_bullying: true,
                severity: 'high',
                risk_score: 0.8,
                recommended_action: 'flag_for_moderator',
            };
            const unsafeResponse = {
                unsafe: false,
                categories: [],
                risk_score: 0.2,
                recommended_action: 'none',
            };

            vi.spyOn(global, 'fetch')
                .mockResolvedValueOnce(mockFetchResponse(bullyingResponse))
                .mockResolvedValueOnce(mockFetchResponse(unsafeResponse));

            const result = await safenest.analyze('test message');

            expect(result.risk_level).toBe('high');
            expect(result.risk_score).toBe(0.8);
            expect(result.summary).toContain('Bullying detected');
            expect(result.recommended_action).toBe('flag_for_moderator');
        });

        it('should return critical for very high risk scores', async () => {
            const bullyingResponse = { is_bullying: true, severity: 'critical', risk_score: 0.95 };
            const unsafeResponse = { unsafe: true, categories: ['self_harm'], risk_score: 0.92 };

            vi.spyOn(global, 'fetch')
                .mockResolvedValueOnce(mockFetchResponse(bullyingResponse))
                .mockResolvedValueOnce(mockFetchResponse(unsafeResponse));

            const result = await safenest.analyze({ content: 'test', include: ['bullying', 'unsafe'] });

            expect(result.risk_level).toBe('critical');
        });
    });

    describe('analyzeEmotions', () => {
        it('should analyze single content string', async () => {
            const mockResponse = {
                dominant_emotions: ['anxiety', 'stress'],
                emotion_scores: { anxiety: 0.8, stress: 0.7 },
                trend: 'worsening',
                summary: 'Test summary',
                recommended_followup: 'Test followup',
            };

            vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(mockResponse));

            const result = await safenest.analyzeEmotions({
                content: 'I feel stressed',
            });

            expect(result.dominant_emotions).toContain('anxiety');
            expect(result.trend).toBe('worsening');

            const call = vi.mocked(fetch).mock.calls[0];
            const body = JSON.parse(call[1]?.body as string);
            expect(body.messages).toEqual([{ sender: 'user', text: 'I feel stressed' }]);
        });

        it('should analyze message history', async () => {
            const mockResponse = {
                dominant_emotions: ['sadness'],
                emotion_scores: { sadness: 0.9 },
                trend: 'stable',
                summary: 'Test summary',
                recommended_followup: 'Test followup',
            };

            vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(mockResponse));

            const result = await safenest.analyzeEmotions({
                messages: [
                    { sender: 'child', content: 'I feel sad' },
                    { sender: 'child', content: 'Very sad' },
                ],
            });

            expect(result.dominant_emotions).toContain('sadness');

            const call = vi.mocked(fetch).mock.calls[0];
            const body = JSON.parse(call[1]?.body as string);
            expect(body.messages[0]).toEqual({ sender: 'child', text: 'I feel sad' });
        });
    });

    describe('getActionPlan', () => {
        it('should generate action plan', async () => {
            const mockResponse = {
                audience: 'child',
                steps: ['Step 1', 'Step 2'],
                tone: 'supportive',
                reading_level: 'grade_5',
            };

            vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(mockResponse));

            const result = await safenest.getActionPlan({
                situation: 'Someone is bullying me',
                childAge: 12,
                audience: 'child',
            });

            expect(result.audience).toBe('child');
            expect(result.steps.length).toBeGreaterThan(0);

            const call = vi.mocked(fetch).mock.calls[0];
            const body = JSON.parse(call[1]?.body as string);
            expect(body.role).toBe('child');
            expect(body.child_age).toBe(12);
        });

        it('should default audience to parent', async () => {
            const mockResponse = { audience: 'parent', steps: [], tone: 'calm' };

            vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(mockResponse));

            await safenest.getActionPlan({ situation: 'test' });

            const call = vi.mocked(fetch).mock.calls[0];
            const body = JSON.parse(call[1]?.body as string);
            expect(body.role).toBe('parent');
        });
    });

    describe('generateReport', () => {
        it('should generate incident report', async () => {
            const mockResponse = {
                summary: 'Incident summary',
                risk_level: 'medium',
                categories: ['bullying'],
                recommended_next_steps: ['Document', 'Contact parent'],
            };

            vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(mockResponse));

            const result = await safenest.generateReport({
                messages: [
                    { sender: 'user1', content: 'Harmful message' },
                    { sender: 'child', content: 'Stop' },
                ],
                childAge: 14,
            });

            expect(result.summary).toBe('Incident summary');
            expect(result.risk_level).toBe('medium');

            const call = vi.mocked(fetch).mock.calls[0];
            const body = JSON.parse(call[1]?.body as string);
            expect(body.messages[0]).toEqual({ sender: 'user1', text: 'Harmful message' });
            expect(body.meta.child_age).toBe(14);
        });
    });

    describe('policy methods', () => {
        it('should get policy configuration', async () => {
            const mockResponse = {
                success: true,
                config: { bullying: { enabled: true } },
            };

            vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(mockResponse));

            const result = await safenest.getPolicy();

            expect(result.success).toBe(true);
            expect(fetch).toHaveBeenCalledWith(
                `${API_BASE_URL}/api/v1/policy`,
                expect.objectContaining({ method: 'GET' })
            );
        });

        it('should set policy configuration', async () => {
            const mockResponse = { success: true };

            vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse(mockResponse));

            await safenest.setPolicy({
                bullying: { enabled: true, minRiskScoreToFlag: 0.5 },
            });

            expect(fetch).toHaveBeenCalledWith(
                `${API_BASE_URL}/api/v1/policy`,
                expect.objectContaining({ method: 'PUT' })
            );
        });
    });

    describe('error handling', () => {
        it('should throw AuthenticationError on 401', async () => {
            vi.spyOn(global, 'fetch').mockResolvedValueOnce(
                mockFetchResponse({ error: { message: 'Invalid API key' } }, { ok: false, status: 401 })
            );

            await expect(safenest.detectBullying({ content: 'test' }))
                .rejects.toThrow(AuthenticationError);
        });

        it('should throw RateLimitError on 429', async () => {
            vi.spyOn(global, 'fetch').mockResolvedValueOnce(
                mockFetchResponse({ error: { message: 'Rate limit exceeded' } }, { ok: false, status: 429 })
            );

            await expect(safenest.detectBullying({ content: 'test' }))
                .rejects.toThrow(RateLimitError);
        });

        it('should throw ValidationError on 400', async () => {
            vi.spyOn(global, 'fetch').mockResolvedValueOnce(
                mockFetchResponse({ error: { message: 'Invalid input' } }, { ok: false, status: 400 })
            );

            await expect(safenest.detectBullying({ content: 'test' }))
                .rejects.toThrow(ValidationError);
        });

        it('should throw ServerError on 500', async () => {
            vi.spyOn(global, 'fetch').mockResolvedValueOnce(
                mockFetchResponse({ error: { message: 'Server error' } }, { ok: false, status: 500 })
            );

            await expect(safenest.detectBullying({ content: 'test' }))
                .rejects.toThrow(ServerError);
        });

        it('should throw TimeoutError when request aborts', async () => {
            vi.spyOn(global, 'fetch').mockRejectedValueOnce(
                Object.assign(new Error('Aborted'), { name: 'AbortError' })
            );

            await expect(safenest.detectBullying({ content: 'test' }))
                .rejects.toThrow(TimeoutError);
        });
    });

    describe('input validation', () => {
        it('should reject empty content', async () => {
            await expect(safenest.detectBullying({ content: '' }))
                .rejects.toThrow('Content is required');
        });

        it('should reject content exceeding max length', async () => {
            const longContent = 'a'.repeat(60000);
            await expect(safenest.detectBullying({ content: longContent }))
                .rejects.toThrow('exceeds maximum length');
        });

        it('should reject empty messages array', async () => {
            await expect(safenest.detectGrooming({ messages: [] }))
                .rejects.toThrow('cannot be empty');
        });

        it('should reject too many messages', async () => {
            const messages = Array(150).fill({ role: 'child', content: 'test' });
            await expect(safenest.detectGrooming({ messages }))
                .rejects.toThrow('exceeds maximum count');
        });

        it('should require content or messages for analyzeEmotions', async () => {
            await expect(safenest.analyzeEmotions({}))
                .rejects.toThrow('Either content or messages is required');
        });

        it('should require situation for getActionPlan', async () => {
            await expect(safenest.getActionPlan({ situation: '' }))
                .rejects.toThrow('Situation description is required');
        });
    });

    describe('usage tracking', () => {
        it('should capture usage from response headers', async () => {
            vi.spyOn(global, 'fetch').mockResolvedValueOnce(
                mockFetchResponse(
                    { is_bullying: false },
                    {
                        headers: {
                            'x-monthly-limit': '10000',
                            'x-monthly-used': '5000',
                            'x-monthly-remaining': '5000',
                            'x-ratelimit-limit': '1000',
                            'x-ratelimit-remaining': '999',
                            'x-request-id': 'req_123',
                        },
                    }
                )
            );

            await safenest.detectBullying({ content: 'test' });

            expect(safenest.usage).toEqual({
                limit: 10000,
                used: 5000,
                remaining: 5000,
            });
            expect(safenest.rateLimit).toEqual({
                limit: 1000,
                remaining: 999,
                reset: undefined,
            });
            expect(safenest.lastRequestId).toBe('req_123');
        });

        it('should track latency', async () => {
            vi.spyOn(global, 'fetch').mockResolvedValueOnce(mockFetchResponse({ is_bullying: false }));

            await safenest.detectBullying({ content: 'test' });

            expect(safenest.lastLatencyMs).toBeGreaterThanOrEqual(0);
        });
    });
});
