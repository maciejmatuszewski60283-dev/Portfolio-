const API_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
};

export function json(body: unknown, status = 200, extra: HeadersInit = {}): Response {
  const headers = new Headers(API_HEADERS);
  new Headers(extra).forEach((value, key) => headers.set(key, value));
  return new Response(JSON.stringify(body), { status, headers });
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  return origin === new URL(request.url).origin;
}

export async function readBody(request: Request, maxBytes: number): Promise<string | null> {
  const declared = Number(request.headers.get('Content-Length') ?? 0);
  if (declared > maxBytes) return null;

  const reader = request.body?.getReader();
  if (!reader) return '';

  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const buffer = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(buffer);
}
