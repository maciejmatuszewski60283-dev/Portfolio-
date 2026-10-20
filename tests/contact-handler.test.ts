import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { handleContact } from '../worker/contact';
import type { Env } from '../worker/env';

const ORIGIN = 'https://maciejmatuszewski.pl';

const baseEnv = (): Env => ({
  ASSETS: {} as Env['ASSETS'],
  RESEND_API_KEY: 're_test',
  CONTACT_TO_EMAIL: 'odbiorca@example.pl',
  CONTACT_FROM_EMAIL: 'Formularz <formularz@example.pl>',
});

const validBody = () => ({
  name: 'Jan Kowalski',
  email: 'Jan@Example.pl',
  company: '',
  subject: 'Nowa strona',
  message: 'Chciałbym porozmawiać o nowej stronie internetowej.',
  privacy: true,
  website: '',
  startedAt: Date.now() - 10_000,
});

const request = (body: unknown, init: RequestInit & { origin?: string | null } = {}) => {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (init.origin !== null) headers.set('Origin', init.origin ?? ORIGIN);
  return new Request(`${ORIGIN}/api/contact`, {
    method: init.method ?? 'POST',
    headers,
    body:
      init.method === 'GET' ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
};

describe('handleContact', () => {
  let fetcher: Mock<typeof fetch>;

  beforeEach(() => {
    fetcher = vi.fn<typeof fetch>(async () => new Response('{"id":"1"}', { status: 200 }));
  });

  it('sends a valid message through the e-mail API', async () => {
    const response = await handleContact(request(validBody()), baseEnv(), fetcher);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true });

    expect(fetcher).toHaveBeenCalledOnce();
    const [url, init] = fetcher.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    const payload = JSON.parse(init.body as string);
    expect(payload.to).toEqual(['odbiorca@example.pl']);
    expect(payload.reply_to).toBe('jan@example.pl');
    expect(payload.text).toContain('Chciałbym porozmawiać');
    expect(payload.html).toBeUndefined();
  });

  it('rejects other HTTP methods', async () => {
    const response = await handleContact(request(null, { method: 'GET' }), baseEnv(), fetcher);
    expect(response.status).toBe(405);
  });

  it('rejects cross-origin and origin-less requests', async () => {
    const foreign = await handleContact(
      request(validBody(), { origin: 'https://evil.example' }),
      baseEnv(),
      fetcher,
    );
    const missing = await handleContact(request(validBody(), { origin: null }), baseEnv(), fetcher);
    expect(foreign.status).toBe(403);
    expect(missing.status).toBe(403);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('returns field errors for invalid data', async () => {
    const response = await handleContact(
      request({ ...validBody(), email: 'zly-adres', privacy: false }),
      baseEnv(),
      fetcher,
    );
    expect(response.status).toBe(422);
    const body = await response.json();
    expect(Object.keys(body.fields).sort()).toEqual(['email', 'privacy']);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON and oversized bodies', async () => {
    const malformed = await handleContact(request('{nie-json'), baseEnv(), fetcher);
    const oversized = await handleContact(
      request({ ...validBody(), message: 'x'.repeat(20_000) }),
      baseEnv(),
      fetcher,
    );
    expect(malformed.status).toBe(400);
    expect(oversized.status).toBe(413);
  });

  it('silently drops honeypot and too-fast submissions', async () => {
    const trapped = await handleContact(
      request({ ...validBody(), website: 'https://spam.example' }),
      baseEnv(),
      fetcher,
    );
    const tooFast = await handleContact(
      request({ ...validBody(), startedAt: Date.now() }),
      baseEnv(),
      fetcher,
    );
    expect(trapped.status).toBe(200);
    expect(tooFast.status).toBe(200);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('applies the rate limiter', async () => {
    const env = { ...baseEnv(), CONTACT_RATE_LIMITER: { limit: async () => ({ success: false }) } };
    const response = await handleContact(request(validBody()), env, fetcher);
    expect(response.status).toBe(429);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('reports unavailability when e-mail delivery is not configured', async () => {
    const response = await handleContact(
      request(validBody()),
      { ASSETS: {} as Env['ASSETS'] },
      fetcher,
    );
    expect(response.status).toBe(503);
  });

  it('reports a provider failure without leaking details', async () => {
    fetcher.mockResolvedValueOnce(new Response('{"message":"invalid key"}', { status: 401 }));
    const response = await handleContact(request(validBody()), baseEnv(), fetcher);
    expect(response.status).toBe(502);
    expect(JSON.stringify(await response.json())).not.toContain('invalid key');
  });
});
