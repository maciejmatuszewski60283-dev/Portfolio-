import { describe, expect, it } from 'vitest';
import { normalizeText, validateContact, type ContactPayload } from '../src/lib/contact-rules';

const valid: ContactPayload = {
  name: 'Jan Kowalski',
  email: 'jan@example.pl',
  company: '',
  subject: 'Nowa strona firmowa',
  message: 'Potrzebuję strony internetowej dla mojej firmy z Poznania.',
  privacy: true,
};

describe('validateContact', () => {
  it('accepts a complete message', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('reports every missing required field', () => {
    const errors = validateContact({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: '',
      privacy: false,
    });
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name', 'privacy', 'subject']);
  });

  it.each(['jan', 'jan@', 'jan@example', 'jan kowalski@example.pl', '<a>@example.pl'])(
    'rejects invalid e-mail %s',
    (email) => {
      expect(validateContact({ ...valid, email }).email).toBeDefined();
    },
  );

  it('enforces maximum lengths', () => {
    const errors = validateContact({
      ...valid,
      company: 'x'.repeat(121),
      message: 'x'.repeat(5001),
    });
    expect(errors.company).toBeDefined();
    expect(errors.message).toBeDefined();
  });

  it('counts Polish characters as single characters', () => {
    expect(validateContact({ ...valid, name: 'Łó' }).name).toBeUndefined();
  });
});

describe('normalizeText', () => {
  it('collapses whitespace in single-line fields', () => {
    expect(normalizeText('  Jan \n\t Kowalski ')).toBe('Jan Kowalski');
  });

  it('keeps line breaks in multiline fields and strips control characters', () => {
    expect(normalizeText('Linia 1\r\nLinia 2\u0007', true)).toBe('Linia 1\nLinia 2');
  });

  it('returns an empty string for non-string input', () => {
    expect(normalizeText(42)).toBe('');
    expect(normalizeText(undefined)).toBe('');
  });
});
