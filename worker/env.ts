export interface Env {
  ASSETS: Fetcher;
  CONTACT_RATE_LIMITER?: RateLimit;
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}
