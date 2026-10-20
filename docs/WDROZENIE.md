# Wdrożenie, domena i Cloudflare

## Co jest zaimplementowane w kodzie, a co wymaga konfiguracji

| Element                                                                                                                  | Stan                                                           |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| Nagłówki bezpieczeństwa (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP/CORP) — `public/_headers` | ✅ w kodzie, działa po wdrożeniu na Cloudflare                 |
| Walidacja danych formularza po stronie serwera, limity długości, limit rozmiaru żądania (16 kB)                          | ✅ w kodzie                                                    |
| Honeypot i minimalny czas wypełnienia formularza (anty-spam)                                                             | ✅ w kodzie                                                    |
| Sprawdzanie nagłówka `Origin` (blokada wysyłki z innych domen, brak CORS)                                                | ✅ w kodzie                                                    |
| Limit 3 wysyłek na minutę z jednego IP (binding Rate Limiting w `wrangler.jsonc`)                                        | ✅ w kodzie, działa po wdrożeniu na Workers                    |
| Sekrety tylko po stronie Workera, bez dostępu z przeglądarki                                                             | ✅ w kodzie — **wymaga dodania sekretów w Cloudflare**         |
| Wysyłka e-maili przez Resend                                                                                             | ⚠️ wymaga konta Resend, weryfikacji domeny i sekretów          |
| Podłączenie domeny maciejmatuszewski.pl                                                                                  | ⚠️ wymaga zmiany serwerów DNS u rejestratora                   |
| Ochrona DDoS, CDN, SSL                                                                                                   | ⚠️ działa dopiero, gdy ruch domeny przechodzi przez Cloudflare |
| Reguły WAF / dodatkowy rate limiting na brzegu sieci                                                                     | ⚠️ konfiguracja w panelu Cloudflare (opcjonalnie)              |

Sam plik konfiguracyjny nie oznacza ochrony — domena musi korzystać z serwerów nazw Cloudflare (lub być do niego podpięta), a Worker musi być wdrożony.

## 1. Wdrożenie na Cloudflare Workers

```bash
npm install
npx wrangler login          # logowanie do konta Cloudflare w przeglądarce
npm run deploy              # build + wrangler deploy
```

Po pierwszym wdrożeniu strona będzie dostępna pod adresem `https://maciejmatuszewski-portfolio.<konto>.workers.dev`.

Alternatywnie: w panelu Cloudflare → **Workers & Pages → Create → Import a repository** podłącz to repozytorium GitHub. Ustawienia: build command `npm run build`, deploy command `npx wrangler deploy`. Każdy push na gałąź produkcyjną wdroży stronę automatycznie.

## 2. Zmienne środowiskowe (sekrety)

Ustawiane w Cloudflare, **nigdy** w repozytorium ani w kodzie frontendu:

| Nazwa                | Opis                                                     | Przykład                                     |
| -------------------- | -------------------------------------------------------- | -------------------------------------------- |
| `RESEND_API_KEY`     | klucz API z panelu Resend (uprawnienie „Sending access”) | `re_...`                                     |
| `CONTACT_TO_EMAIL`   | adres, na który mają trafiać wiadomości                  | Twoja skrzynka                               |
| `CONTACT_FROM_EMAIL` | nadawca z domeny zweryfikowanej w Resend                 | `Formularz <formularz@maciejmatuszewski.pl>` |

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put CONTACT_TO_EMAIL
npx wrangler secret put CONTACT_FROM_EMAIL
```

Lokalnie wartości trafiają do `.dev.vars` (plik jest w `.gitignore`).

## 3. Konfiguracja wysyłki formularza (Resend)

1. Załóż konto na resend.com.
2. **Domains → Add domain** → `maciejmatuszewski.pl` (można wybrać region UE). Dodaj w DNS Cloudflare rekordy podane przez Resend (SPF/DKIM, opcjonalnie DMARC) i poczekaj na weryfikację.
3. **API Keys → Create** z uprawnieniem tylko do wysyłki.
4. Ustaw trzy sekrety z punktu 2 i wdroż ponownie.
5. Wyślij wiadomość testową przez formularz na stronie.

Wiadomości są wysyłane jako zwykły tekst, a pole „Odpowiedz do” ustawiane jest na adres osoby kontaktującej się — wystarczy kliknąć „Odpowiedz”.

Plan darmowy Resend ma limity dzienne i miesięczne — dla formularza kontaktowego zwykle wystarczające. Sprawdź aktualne warunki przed wdrożeniem.

## 4. Podłączenie domeny i Cloudflare

1. W panelu Cloudflare: **Add a site** → `maciejmatuszewski.pl` → plan Free.
2. U rejestratora domeny zmień serwery nazw (NS) na te wskazane przez Cloudflare. Propagacja trwa zwykle od kilku minut do 24 h.
3. Po aktywacji strefy: **Workers & Pages → maciejmatuszewski-portfolio → Settings → Domains & Routes → Add → Custom domain** → `maciejmatuszewski.pl`, następnie to samo dla `www.maciejmatuszewski.pl`.
4. Przekierowanie `www` → bez `www`: **Rules → Redirect Rules → Create** — warunek „Hostname equals www.maciejmatuszewski.pl”, akcja: Dynamic redirect `concat("https://maciejmatuszewski.pl", http.request.uri.path)`, kod 301, zachowaj query string.
5. **SSL/TLS → Overview:** tryb _Full (strict)_. **Edge Certificates:** włącz _Always Use HTTPS_, _Automatic HTTPS Rewrites_, minimalna wersja TLS 1.2.
6. HSTS jest już wysyłany przez `public/_headers` (1 rok, z subdomenami). Nie włączaj `preload`, dopóki nie masz pewności, że wszystkie subdomeny działają przez HTTPS.

## 5. Ochrona przed nadużyciami i DDoS — zalecenia

- **Ochrona DDoS** warstw 3/4 i 7 jest włączona automatycznie dla domen obsługiwanych przez Cloudflare, także w planie Free.
- **Security → Bots:** włącz _Bot Fight Mode_.
- **Security → WAF → Rate limiting rules** (plan Free pozwala na jedną regułę): ścieżka `/api/contact`, metoda POST, np. 5 żądań / 10 s na IP → akcja Block. To uzupełnienie limitu zaimplementowanego w Workerze.
- **Security → Settings:** poziom bezpieczeństwa _Medium_; w razie ataku tymczasowo _I'm Under Attack_.
- Opcjonalnie **Turnstile** (CAPTCHA Cloudflare) — nie jest dodany, bo wymaga kluczy i zmian w polityce prywatności. Warto rozważyć, jeśli mimo honeypota pojawi się spam.

### Ograniczenia

- Żadna konfiguracja nie gwarantuje odporności na każdy atak. Plan Free nie daje m.in. zaawansowanych reguł WAF ani wsparcia przy incydentach.
- Limit w Workerze jest liczony per lokalizacja Cloudflare i jest przybliżony — to ochrona przed nadużyciem formularza, nie precyzyjny licznik.
- Honeypot i minimalny czas wypełnienia odsiewają proste boty, ale nie zatrzymają człowieka wysyłającego spam ręcznie.

## 6. Google Search Console i analityka

Zob. [SEO.md](SEO.md#google-search-console). Strona domyślnie nie używa żadnej analityki. Najprostsza opcja zgodna z prywatnością to **Cloudflare Web Analytics** (bez cookies) — przed włączeniem dopisz ją do polityki prywatności i dodaj `https://static.cloudflareinsights.com` do `script-src` oraz `https://cloudflareinsights.com` do `connect-src` w `public/_headers` (obecna polityka CSP zablokuje skrypt). Google Analytics wymagałby banera zgody na cookies.
