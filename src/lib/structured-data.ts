import { activeSocials, site } from '@/config/site';
import { services } from '@/data/services';

const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;

export function homeStructuredData() {
  const sameAs = [...activeSocials.map((item) => item.url), site.discordUrl].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${site.url}/`,
        name: site.name,
        inLanguage: 'pl-PL',
        publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${site.url}/#profile`,
        url: `${site.url}/`,
        name: site.title,
        description: site.description,
        inLanguage: 'pl-PL',
        isPartOf: { '@id': websiteId },
        mainEntity: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: site.name,
        url: `${site.url}/`,
        jobTitle: ['Web Developer', 'Interface Designer'],
        address: {
          '@type': 'PostalAddress',
          addressLocality: site.city,
          addressRegion: site.region,
          addressCountry: site.countryCode,
        },
        knowsAbout: services.map((service) => service.title),
        makesOffer: services.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.title,
            description: service.description,
            areaServed: { '@type': 'City', name: site.city },
          },
        })),
        ...(site.email ? { email: `mailto:${site.email}` } : {}),
        ...(sameAs.length ? { sameAs } : {}),
      },
    ],
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, site.url).href,
    })),
  };
}
