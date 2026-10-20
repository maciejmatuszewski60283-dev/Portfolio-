# maciejmatuszewski.pl

Portfolio i strona-wizytówka Macieja Matuszewskiego — web developera i projektanta interfejsów z Poznania.

- **Frontend:** [Astro](https://astro.build) — statyczny HTML, ok. 7 kB JavaScriptu, własne fonty (bez zapytań do Google Fonts).
- **Backend formularza:** Cloudflare Worker (`worker/`) wysyłający wiadomości przez API [Resend](https://resend.com).
- **Hosting:** Cloudflare Workers ze statycznymi zasobami (CDN, SSL, ochrona DDoS na poziomie sieci Cloudflare).

## Wymagania

- Node.js 22+ (`.nvmrc`)
- konto Cloudflare (wdrożenie) i konto Resend (wysyłka formularza)

## Uruchomienie lokalne

```bash
npm install
npm run dev        # serwer deweloperski Astro: http://localhost:4321 (bez backendu formularza)
npm run preview    # produkcyjny build + Worker lokalnie: http://localhost:8787 (z backendem formularza)
```

Aby formularz działał lokalnie, skopiuj `.dev.vars.example` do `.dev.vars` i uzupełnij wartości. Bez nich endpoint zwraca czytelny błąd „Formularz jest chwilowo niedostępny” (HTTP 503) — nie udaje wysyłki.

## Skrypty

| Polecenie              | Opis                                                |
| ---------------------- | --------------------------------------------------- |
| `npm run build`        | build produkcyjny do `dist/`                        |
| `npm run check`        | sprawdzanie typów (Astro + Worker)                  |
| `npm test`             | testy jednostkowe walidacji i endpointu formularza  |
| `npm run format:check` | kontrola formatowania (Prettier)                    |
| `npm run deploy`       | build i wdrożenie na Cloudflare (`wrangler deploy`) |

## Struktura

```
src/
  config/site.ts        dane strony: domena, opisy SEO, Discord, e-mail, profile społecznościowe
  config/legal.ts       dane do polityki prywatności
  data/                 treści sekcji: o mnie, usługi, technologie, proces, FAQ
  content/projects/     projekty portfolio (pliki Markdown)
  assets/projects/      zrzuty ekranu projektów (optymalizowane automatycznie)
  components/           sekcje i elementy interfejsu
  layouts/              szablony stron (metadane SEO, Open Graph, JSON-LD)
  pages/                strona główna, polityka prywatności, 404, podstrony projektów, sitemap, robots
  lib/contact-rules.ts  walidacja formularza współdzielona przez przeglądarkę i Worker
worker/                 endpoint POST /api/contact
public/_headers         nagłówki bezpieczeństwa (CSP, HSTS itd.) i cache
tests/                  testy Vitest
docs/                   wdrożenie i Cloudflare, SEO, RODO
```

## Edycja treści

- **Dane kontaktowe, Discord, profile:** `src/config/site.ts`. Puste pola są ukrywane — strona nie pokazuje linków do nieistniejących adresów.
- **Popup Discord:** pojawia się automatycznie dopiero, gdy `discordUrl` w `src/config/site.ts` zawiera prawidłowy link (np. `https://discord.com/users/<ID>` lub zaproszenie `https://discord.gg/<kod>`). Po zamknięciu nie wraca przez 7 dni (w `localStorage` zapisywana jest wyłącznie data zamknięcia).
- **Technologie:** `src/data/skills.ts` — blok jest ukryty, dopóki lista jest pusta.
- **Teksty sekcji:** pliki w `src/data/`.

## Dodawanie projektów

1. Skopiuj `src/content/projects/_szablon.md` jako np. `src/content/projects/sklep-kawiarnia.md` (nazwa pliku = adres `/projekty/sklep-kawiarnia/`; pliki zaczynające się od `_` są pomijane).
2. Wgraj zrzuty ekranu do `src/assets/projects/sklep-kawiarnia/` (JPG/PNG, najlepiej min. 1600 px szerokości). Astro sam generuje warianty WebP w kilku rozdzielczościach.
3. Uzupełnij pola: `title`, `description`, `category`, `technologies`, `status` (`completed`, `in-progress`, `concept`), `date`, `cover`, `coverAlt`, opcjonalnie `gallery`, `liveUrl`, `repoUrl`, `featured`. Ustaw `draft: false`.
4. Pod nagłówkiem YAML opisz projekt w Markdownie (wyzwanie, rozwiązanie, efekt).
5. `npm run build` — schemat danych jest walidowany, a błędne pole zatrzyma build z czytelnym komunikatem.

Gdy istnieje co najmniej jeden opublikowany projekt, sekcja „Projekty” automatycznie pokazuje karty zamiast stanu początkowego, a podstrona trafia do `sitemap.xml`.

## Wdrożenie

Szczegóły: [docs/WDROZENIE.md](docs/WDROZENIE.md) (Cloudflare, domena, zmienne środowiskowe, formularz).
SEO: [docs/SEO.md](docs/SEO.md). Prywatność: [docs/RODO.md](docs/RODO.md).
