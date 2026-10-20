export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  scope: string[];
}

export const services: Service[] = [
  {
    id: 'strony-internetowe',
    icon: 'browser',
    title: 'Strony internetowe',
    description:
      'Nowoczesne, responsywne strony internetowe dla firm, specjalistów i projektów osobistych, od wizytówki po rozbudowany serwis.',
    scope: [
      'Strony firmowe i wizytówki',
      'Landing page i strony produktowe',
      'Portfolio i strony osobiste',
    ],
  },
  {
    id: 'aplikacje-internetowe',
    icon: 'app',
    title: 'Aplikacje internetowe i PWA',
    description:
      'Aplikacje działające w przeglądarce, które można zainstalować na telefonie i korzystać z nich jak z natywnych programów.',
    scope: [
      'Panele i narzędzia webowe',
      'Progresywne aplikacje (PWA)',
      'Formularze i procesy online',
    ],
  },
  {
    id: 'projektowanie-ui-ux',
    icon: 'pen',
    title: 'Projektowanie UI/UX',
    description:
      'Projektowanie interfejsów, które są czytelne, spójne i prowadzą użytkownika do celu bez zbędnych kroków.',
    scope: [
      'Architektura informacji',
      'Projekty widoków i prototypy',
      'Spójne systemy komponentów',
    ],
  },
  {
    id: 'interaktywne-rozwiazania',
    icon: 'spark',
    title: 'Interaktywne rozwiązania i wizualizacje',
    description:
      'Animacje, interaktywne elementy i wizualizacje danych, które pomagają opowiedzieć historię produktu lub marki.',
    scope: ['Mikrointerakcje i animacje', 'Wizualizacje i wykresy', 'Interaktywne prezentacje'],
  },
  {
    id: 'projekty-programistyczne',
    icon: 'code',
    title: 'Projekty programistyczne',
    description:
      'Rozwiązania programistyczne dopasowane do konkretnego problemu, od integracji po narzędzia automatyzujące pracę.',
    scope: ['Integracje i formularze', 'Rozwój istniejących stron', 'Optymalizacja wydajności'],
  },
];
