export const site = {
  url: 'https://maciejmatuszewski.pl',
  name: 'Maciej Matuszewski',
  shortName: 'MM',
  role: 'Web Developer & Interface Designer',
  rolePl: 'Web developer i projektant interfejsów',
  locale: 'pl_PL',
  lang: 'pl',
  city: 'Poznań',
  region: 'Wielkopolska',
  country: 'Polska',
  countryCode: 'PL',

  title: 'Maciej Matuszewski | Web developer i projektant stron internetowych, Poznań',
  description:
    'Projektowanie i tworzenie nowoczesnych stron internetowych, aplikacji webowych i interfejsów UI/UX. Maciej Matuszewski, web developer z Poznania.',

  /**
   * Publiczny link do profilu lub serwera Discord, np. https://discord.com/users/<ID>
   * albo zaproszenie https://discord.gg/<kod>. Pusta wartość ukrywa popup i odnośniki do Discorda.
   */
  discordUrl: '',

  /** Publiczny adres e-mail wyświetlany w sekcji kontaktu. Pusta wartość: adres nie jest pokazywany. */
  email: '',

  /** Profile społecznościowe. Wyświetlane są tylko pozycje z uzupełnionym adresem. */
  social: [
    { label: 'GitHub', icon: 'github', url: '' },
    { label: 'LinkedIn', icon: 'linkedin', url: '' },
  ],

  /** Wartość z Google Search Console (metoda „Tag HTML”). Zalecana jest weryfikacja przez DNS. */
  googleSiteVerification: '',
} as const;

export const navigation = [
  { label: 'O mnie', href: '/#o-mnie' },
  { label: 'Usługi', href: '/#uslugi' },
  { label: 'Projekty', href: '/#projekty' },
  { label: 'Proces', href: '/#proces' },
  { label: 'Kontakt', href: '/#kontakt' },
] as const;

export const activeSocials = site.social.filter((item) => item.url !== '');
