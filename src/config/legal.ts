/**
 * Dane do polityki prywatności i klauzuli informacyjnej.
 * Pola z pustą wartością są wyświetlane na stronie jako wyraźnie oznaczone miejsca do uzupełnienia.
 */
export const legal = {
  controllerName: 'Maciej Matuszewski',
  /** Np. nazwa działalności, adres, NIP — jeśli działalność jest zarejestrowana. */
  controllerDetails: '',
  /** Adres e-mail do spraw związanych z danymi osobowymi. */
  privacyEmail: '',
  /** Data, od której obowiązuje dokument, w formacie RRRR-MM-DD. */
  effectiveDate: '',
  /** Ile czasu przechowywana jest korespondencja z formularza, gdy nie dochodzi do współpracy. */
  retentionPeriod: '',
  hostingProvider: 'Cloudflare, Inc.',
  emailProvider: 'Resend (Plus Five Five, Inc.)',
  /** Dostawca skrzynki, na którą trafiają wiadomości z formularza, np. Google (Gmail). */
  mailboxProvider: '',
  /** Potwierdzony mechanizm transferu danych poza EOG dla dostawców — wymaga weryfikacji. */
  transferBasis: '',
} as const;
