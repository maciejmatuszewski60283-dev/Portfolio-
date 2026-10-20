export const contactLimits = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  company: { max: 120 },
  subject: { min: 3, max: 150 },
  message: { min: 20, max: 5000 },
} as const;

export const MIN_FILL_TIME_MS = 3000;

export interface ContactPayload {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  privacy: boolean;
}

export type ContactField = keyof ContactPayload;
export type ContactErrors = Partial<Record<ContactField, string>>;

const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

const length = (value: string) => [...value].length;

export function normalizeText(value: unknown, multiline = false): string {
  if (typeof value !== 'string') return '';
  const cleaned = value.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '');
  return multiline ? cleaned.trim() : cleaned.replace(/\s+/g, ' ').trim();
}

export function validateContact(input: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};
  const { name, email, company, subject, message } = contactLimits;

  if (length(input.name) < name.min) errors.name = 'Podaj imię lub nazwę (min. 2 znaki).';
  else if (length(input.name) > name.max) errors.name = `Maksymalnie ${name.max} znaków.`;

  if (!input.email) errors.email = 'Podaj adres e-mail.';
  else if (length(input.email) > email.max || !EMAIL_PATTERN.test(input.email))
    errors.email = 'Podaj poprawny adres e-mail.';

  if (length(input.company) > company.max) errors.company = `Maksymalnie ${company.max} znaków.`;

  if (length(input.subject) < subject.min)
    errors.subject = 'Podaj temat wiadomości (min. 3 znaki).';
  else if (length(input.subject) > subject.max)
    errors.subject = `Maksymalnie ${subject.max} znaków.`;

  if (length(input.message) < message.min)
    errors.message = `Opisz projekt lub pytanie (min. ${message.min} znaków).`;
  else if (length(input.message) > message.max)
    errors.message = `Maksymalnie ${message.max} znaków.`;

  if (!input.privacy)
    errors.privacy = 'Potwierdź zapoznanie się z informacją o przetwarzaniu danych.';

  return errors;
}
