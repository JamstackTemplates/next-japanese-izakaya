import { izakaya } from '../content/izakaya';
import { menu } from '../content/menu';
import { absoluteUrl } from './paths';

/**
 * schema.org Restaurant for search engines and maps, built from the same content as the pages.
 * Late nights keep `closes` earlier than `opens` (Friday 17:00–01:00), which schema.org reads as
 * closing after midnight.
 */
export function izakayaStructuredData() {
  const url = absoluteUrl('/');
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: izakaya.name,
    alternateName: `${izakaya.kindJa} ${izakaya.nameJa}`,
    description: izakaya.introduction,
    ...(url ? { url, hasMenu: absoluteUrl('/menu/') } : {}),
    email: izakaya.email,
    ...(izakaya.phone ? { telephone: izakaya.phone } : {}),
    servesCuisine: ['Japanese', 'Izakaya', 'Yakitori'],
    // Walk-ins only; groups and omakase evenings are arranged by enquiry.
    acceptsReservations: false,
    priceRange: '$$',
    currenciesAccepted: menu.currency,
    address: {
      '@type': 'PostalAddress',
      streetAddress: izakaya.address.street,
      addressLocality: izakaya.address.locality,
      addressRegion: izakaya.address.region,
      postalCode: izakaya.address.postalCode,
      addressCountry: izakaya.address.country,
    },
    openingHoursSpecification: izakaya.hours.filter(entry => entry.opens && entry.closes).map(entry => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: entry.day,
      opens: entry.opens,
      closes: entry.closes,
    })),
    sameAs: izakaya.links.filter(link => link.url.trim()).map(link => link.url),
  };
}

/** JSON for an inline <script type="application/ld+json">, safe against closing the script tag. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
