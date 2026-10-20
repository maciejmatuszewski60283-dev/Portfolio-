# RODO i dokumenty prawne — lista do uzupełnienia

Polityka prywatności (`src/pages/polityka-prywatnosci.astro`) jest **projektem**. Dopóki w `src/config/legal.ts` są puste pola, strona pokazuje komunikat „Projekt dokumentu” i wyróżnione miejsca do uzupełnienia. Dokument nie stanowi porady prawnej — przed publikacją warto skonsultować go z prawnikiem.

## Jak strona przetwarza dane (stan faktyczny)

- **Formularz kontaktowy:** imię/nazwa, e-mail, firma (opcjonalnie), temat, treść. Dane trafiają do Workera Cloudflare, są walidowane i wysyłane e-mailem przez Resend na skrzynkę administratora. Strona nie zapisuje ich w bazie danych ani w pamięci przeglądarki.
- **Checkbox przy formularzu** potwierdza zapoznanie się z informacją o przetwarzaniu (obowiązek informacyjny z art. 13 RODO) — nie jest zgodą marketingową. Brak checkboxów marketingowych.
- **Adres IP** — używany przez Workera wyłącznie do limitu liczby wysyłek (nie jest zapisywany przez kod strony); Cloudflare przetwarza go w ramach hostingu i ochrony.
- **localStorage** — tylko znacznik czasu zamknięcia popupu Discord (`mm:discord-popup-dismissed`). Brak danych osobowych.
- **Cookies** — strona sama ich nie ustawia. Cloudflare może ustawiać techniczne cookies ochronne (np. `__cf_bm`), zwłaszcza po włączeniu Bot Fight Mode.
- **Brak analityki i reklam.** Fonty są serwowane lokalnie (brak transferu IP do Google Fonts).
- Logi Workera (`observability` w `wrangler.jsonc`) nie zawierają treści formularza — kod nie loguje danych.

## Dane i decyzje potrzebne do finalizacji (`src/config/legal.ts`)

1. **Status administratora** — osoba fizyczna czy działalność gospodarcza? Jeśli działalność: pełna nazwa, adres, NIP (`controllerDetails`).
2. **Adres korespondencyjny** administratora (wymagany do wskazania danych kontaktowych administratora; może wystarczyć e-mail — do oceny prawnej).
3. **E-mail do spraw danych osobowych** (`privacyEmail`).
4. **Okres przechowywania** wiadomości, gdy nie dochodzi do współpracy, np. 12 miesięcy (`retentionPeriod`).
5. **Dostawca skrzynki e-mail**, na którą trafiają wiadomości, np. Google, Microsoft, OVH (`mailboxProvider`).
6. **Mechanizm transferu poza EOG** dla Cloudflare, Resend i dostawcy poczty — sprawdź, czy są na liście EU-U.S. Data Privacy Framework (dataprivacyframework.gov) i/lub czy ich umowy powierzenia (DPA) zawierają standardowe klauzule umowne (`transferBasis`).
7. **Umowy powierzenia (DPA)** — zaakceptuj DPA w panelach Cloudflare i Resend (zwykle w ustawieniach konta).
8. **Data obowiązywania** dokumentu (`effectiveDate`, format `RRRR-MM-DD`).
9. Jeśli dodasz analitykę, Turnstile, osadzone treści lub inne usługi — zaktualizuj politykę (i, przy cookies niebędących niezbędnymi, dodaj mechanizm zgody).

## Kwestie wymagające oceny prawnej

- Czy podstawą przetwarzania danych z formularza powinien być art. 6 ust. 1 lit. f, czy lit. b RODO (w projekcie wskazano obie, zależnie od celu).
- Czy zapis w `localStorage` dotyczący popupu mieści się w wyjątku dla danych „niezbędnych” z art. 399 ustawy Prawo komunikacji elektronicznej (dawniej art. 173 Prawa telekomunikacyjnego), czy wymaga zgody. Zastosowano ostrożne rozwiązanie: brak danych osobowych, krótki cel, informacja w polityce.
- Czy przy działalności gospodarczej potrzebny jest regulamin świadczenia usług drogą elektroniczną (formularz kontaktowy jest usługą elektroniczną w rozumieniu u.ś.u.d.e.; w praktyce często wystarcza informacja w polityce, ale to wymaga decyzji).
