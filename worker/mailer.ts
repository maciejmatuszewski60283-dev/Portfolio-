import type { ContactPayload } from '../src/lib/contact-rules';
import type { Env } from './env';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export type MailConfig = Required<
  Pick<Env, 'RESEND_API_KEY' | 'CONTACT_TO_EMAIL' | 'CONTACT_FROM_EMAIL'>
>;

export function getMailConfig(env: Env): MailConfig | null {
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) return null;
  return { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL };
}

export function buildEmail(data: ContactPayload, sentAt: Date) {
  const lines = [
    `Imię / nazwa: ${data.name}`,
    `E-mail: ${data.email}`,
    `Firma: ${data.company || '—'}`,
    `Temat: ${data.subject}`,
    `Wysłano: ${sentAt.toISOString()}`,
    '',
    data.message,
  ];

  return {
    subject: `[Formularz] ${data.subject}`.slice(0, 200),
    text: lines.join('\n'),
  };
}

export async function sendContactEmail(
  config: MailConfig,
  data: ContactPayload,
  idempotencyKey: string,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  const { subject, text } = buildEmail(data, new Date());

  const response = await fetcher(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      from: config.CONTACT_FROM_EMAIL,
      to: [config.CONTACT_TO_EMAIL],
      reply_to: data.email,
      subject,
      text,
    }),
  });

  return response.ok;
}
