import { handleContact } from './contact';
import type { Env } from './env';
import { json } from './http';

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/contact' || pathname === '/api/contact/') {
      return handleContact(request, env);
    }

    if (pathname.startsWith('/api/')) {
      return json({ ok: false, error: 'Nie znaleziono.' }, 404);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
