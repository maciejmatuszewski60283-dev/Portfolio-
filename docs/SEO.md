# SEO — strategia i dalszy rozwój

## Co jest wdrożone

- Unikalny `<title>` i meta description dla każdej strony (`src/config/site.ts`, `BaseLayout.astro`).
- Jeden `H1` na stronę, logiczna hierarchia `H2` (sekcje) → `H3` (usługi, kroki, pytania).
- Semantyczny HTML: `header`, `nav`, `main`, `section` z `aria-labelledby`, `article`, `footer`, listy, `details` dla FAQ.
- Kanoniczne adresy (`https://maciejmatuszewski.pl/...` z końcowym ukośnikiem), `robots.txt`, `sitemap.xml` generowany automatycznie (zawiera też podstrony projektów).
- Open Graph i Twitter Card z obrazem 1200×630 (`public/og-image.png`).
- Dane strukturalne JSON-LD: `WebSite`, `ProfilePage`, `Person` (z lokalizacją Poznań i oferowanymi usługami jako `Offer`/`Service`), na podstronach projektów `CreativeWork` + `BreadcrumbList`. Bez ocen, opinii, cen i danych firmy — nie zostały podane.
- Linkowanie wewnętrzne: nawigacja, odnośniki z hero do usług, CTA w sekcjach, okruszki na podstronach projektów.
- Wydajność (Core Web Vitals): statyczny HTML, ~7 kB JS, fonty lokalne z `preload` i `font-display: swap`, brak zewnętrznych skryptów, responsywne obrazy WebP z `width/height` i `loading="lazy"`, animacje tylko na `transform/opacity`.
- Polityka prywatności i 404 mają `noindex, follow`, endpoint `/api/` zablokowany w `robots.txt`.

## Grupy słów kluczowych

Frazy są wplecione naturalnie w tytuł, opis, nagłówki i treść — bez powtarzania na siłę. Poniższa lista służy do planowania przyszłych treści.

### 1. Marka osobista

Maciej Matuszewski · Maciej Matuszewski programista · Maciej Matuszewski web developer · Maciej Matuszewski Poznań · Maciej Matuszewski strony internetowe · Matuszewski web developer · Maciej Matuszewski portfolio

### 2. Lokalne — Poznań (główny potencjał)

web developer Poznań · programista Poznań · informatyk Poznań · freelancer IT Poznań · twórca stron internetowych Poznań · tworzenie stron internetowych Poznań · strony internetowe Poznań · strony WWW Poznań · projektowanie stron internetowych Poznań · projektowanie stron WWW Poznań · programista stron internetowych Poznań · wykonawca stron internetowych Poznań · strona internetowa dla firmy Poznań · projektant UI/UX Poznań

Odmiany i warianty, które warto stosować w tekstach: „w Poznaniu”, „z Poznania”, „poznański web developer”, „Wielkopolska”, „okolice Poznania” (tylko jeśli realnie obsługujesz te okolice). Warianty bez polskich znaków (np. „tworzenie stron internetowych Poznan”) Google rozpoznaje sam — nie ma potrzeby wstawiać ich do treści.

### 3. Usługowe (ogólnopolskie)

projektowanie stron internetowych · projektowanie stron WWW · tworzenie stron internetowych · profesjonalne strony internetowe · nowoczesne strony internetowe · strony internetowe dla firm · responsywna strona internetowa · strona wizytówka dla firmy · landing page · wykonanie strony internetowej · programista stron internetowych · aplikacje internetowe · aplikacja PWA · projektowanie interfejsów · projektant UI/UX · projektowanie UX · audyt UX · optymalizacja szybkości strony

### 4. Długi ogon (pytania i intencje)

ile kosztuje strona internetowa dla firmy · jak wygląda tworzenie strony internetowej · strona internetowa dla małej firmy Poznań · nowoczesna strona wizytówka · strona internetowa krok po kroku · czym jest aplikacja PWA · jak przygotować treści na stronę internetową · co powinna zawierać strona firmowa · szybka strona internetowa a SEO · jak wybrać wykonawcę strony internetowej

## Rekomendacje dalszego rozwoju

1. **Podstrony usług** — osobne strony np. `/uslugi/strony-internetowe-poznan/`, `/uslugi/aplikacje-pwa/`, `/uslugi/projektowanie-ui-ux/`. Każda z własnym H1, opisem procesu, FAQ i CTA. Strukturę można dodać jako nowe pliki w `src/pages/uslugi/` bez zmian w reszcie projektu.
2. **Realizacje** — każdy projekt jako podstrona z opisem problemu, rozwiązania i efektu (już obsługiwane przez `src/content/projects/`). To najmocniejszy sygnał wiarygodności.
3. **Blog / poradnik** — artykuły odpowiadające na frazy z grupy 4 (`src/pages/blog/` + nowa kolekcja treści).
4. **Profil Firmy w Google** — tylko jeśli spełniasz wytyczne Google (np. obsługujesz klientów w określonym obszarze). Nie podawaj adresu, pod którym nie przyjmujesz klientów — można ustawić obszar działalności bez adresu.
5. **Spójne dane (NAP)** — te same imię i nazwisko, miasto i kontakt na stronie, w profilach społecznościowych i katalogach.
6. **Linki zewnętrzne** — profil na GitHubie i LinkedIn z linkiem do strony, wpisy w rzetelnych katalogach freelancerów, współprace. Bez kupowania linków.
7. **Opinie** — wyłącznie prawdziwe, od rzeczywistych klientów (np. w Profilu Firmy w Google). Nie dodawaj ich do danych strukturalnych strony bez spełnienia wytycznych.
8. **Aktualizacja `sameAs`** — po uzupełnieniu profili w `src/config/site.ts` trafią automatycznie do danych strukturalnych.

## Google Search Console

1. Wejdź na search.google.com/search-console → **Dodaj usługę → Domena** → `maciejmatuszewski.pl`.
2. Dodaj w DNS Cloudflare rekord TXT podany przez Google (zalecane — weryfikuje całą domenę).
   Alternatywa: metoda „Tag HTML” — wpisz wartość `content` w `googleSiteVerification` w `src/config/site.ts`.
3. **Mapy witryn** → dodaj `https://maciejmatuszewski.pl/sitemap.xml`.
4. Po indeksacji sprawdzaj raporty „Strony”, „Podstawowe wskaźniki internetowe” i „Skuteczność”.
5. Warto też dodać stronę do Bing Webmaster Tools (import z Search Console).

## Pozycje w Google

Strona ma solidne podstawy techniczne i treściowe, ale pozycja zależy od konkurencji, czasu, liczby i jakości treści oraz linków. Nie da się zagwarantować konkretnego miejsca w wynikach.
