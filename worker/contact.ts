import {
  MIN_FILL_TIME_MS,
  normalizeText,
  validateContact,
  type ContactPayload,
} from '../src/lib/contact-rules';
import type { Env } from './env';
import { isSameOrigin, json, readBody } from './http';
import { getMailConfig, sendContactEmail } from './mailer';

const MAX_BODY_BYTES = 16 * 1024;

const messages = {
  method: 'Niedozwolona metoda.',
  origin: 'Żądanie odrzucone.',
  format: 'Nieprawidłowy format danych.',
  tooLarge: 'Wiadomość jest zbyt duża.',
  rateLimited: 'Wysłano zbyt wiele wiadomości. Spróbuj ponownie za chwilę.',
  invalid: 'Popraw zaznaczone pola.',
  unavailable: 'Formularz jest chwilowo niedostępny. Spróbuj ponownie później.',
  failed: 'Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę.',
  sent: 'Dziękuję! Wiadomość została wysłana.',
} as const;

function parsePayload(raw: Record<string, unknown>): ContactPayload {
  return {
    name: normalizeText(raw.name),
    email: normalizeText(raw.email).toLowerCase(),
    company: normalizeText(raw.company),
    subject: normalizeText(raw.subject),
    message: normalizeText(raw.message, true),
    privacy: raw.privacy === true || raw.privacy === 'on',
  };
}

function looksAutomated(raw: Record<string, unknown>, now: number): boolean {
  if (typeof raw.website === 'string' && raw.website.trim() !== '') return true;
  const startedAt = Number(raw.startedAt);
  if (!Number.isFinite(startedAt)) return true;
  return now - startedAt < MIN_FILL_TIME_MS;
}

export async function handleContact(
  request: Request,
  env: Env,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ ok: false, error: messages.method }, 405, { Allow: 'POST' });
  }

  if (!isSameOrigin(request)) return json({ ok: false, error: messages.origin }, 403);

  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) {
    return json({ ok: false, error: messages.format }, 415);
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (env.CONTACT_RATE_LIMITER) {
    const { success } = await env.CONTACT_RATE_LIMITER.limit({ key: `contact:${ip}` });
    if (!success)
      return json({ ok: false, error: messages.rateLimited }, 429, { 'Retry-After': '60' });
  }

  const body = await readBody(request, MAX_BODY_BYTES);
  if (body === null) return json({ ok: false, error: messages.tooLarge }, 413);

  let raw: unknown;
  try {
    raw = JSON.parse(body);
  } catch {
    return json({ ok: false, error: messages.format }, 400);
  }
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return json({ ok: false, error: messages.format }, 400);
  }

  const fields = raw as Record<string, unknown>;

  if (looksAutomated(fields, Date.now())) {
    return json({ ok: true, message: messages.sent });
  }

  const payload = parsePayload(fields);
  const errors = validateContact(payload);
  if (Object.keys(errors).length > 0) {
    return json({ ok: false, error: messages.invalid, fields: errors }, 422);
  }

  const config = getMailConfig(env);
  if (!config) return json({ ok: false, error: messages.unavailable }, 503);

  try {
    const sent = await sendContactEmail(config, payload, crypto.randomUUID(), fetcher);
    if (!sent) return json({ ok: false, error: messages.failed }, 502);
  } catch {
    return json({ ok: false, error: messages.failed }, 502);
  }

  return json({ ok: true, message: messages.sent });
}
