'use client';

import { usePathname } from 'next/navigation';

export default function SchemaOrg() {
  const pathname = usePathname();
  const baseUrl = 'https://vibesurfschool.com';
  const currentUrl = `${baseUrl}${pathname}`;
  
  // Local Business schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': baseUrl,
    name: 'Vibe Surf School',
    description: 'Professional surf school offering lessons for all skill levels in Fort Lauderdale, Florida.',
    url: baseUrl,
    telephone: '+1-954-555-5555', // Replace with actual phone number
    email: 'vibesurfschoolftl@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Pompano Beach & Dania Beach', // Update with actual street address
      addressLocality: 'Fort Lauderdale',
      addressRegion: 'FL',
      postalCode: '33301', // Update with actual postal code
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 26.235844, // Update with actual coordinates
      longitude: -80.121384 // Update with actual coordinates
    },
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '18:00'
      }
    ],
    sameAs: [
      'https://www.facebook.com/vibesurfschool',
      'https://www.instagram.com/vibesurfschool',
      'https://www.youtube.com/channel/vibesurfschool' // Update with actual channel URL
    ],
    image: [
      `${baseUrl}/images/vibe-surfschool-logo.svg`,
      `${baseUrl}/images/surfing/Testimonials.png`
    ],
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '75',
      highPrice: '300',
      offerCount: '10'
    }
  };

  // Service schema for surf lessons
  const surfLessonsSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Surf Lessons',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Vibe Surf School',
      url: baseUrl
    },
    description: 'Professional surf lessons for all skill levels in Fort Lauderdale, Florida.',
    areaServed: {
      '@type': 'City',
      name: 'Fort Lauderdale'
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: '75',
      availability: 'https://schema.org/InStock'
    }
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(
          pathname === '/' 
            ? [localBusinessSchema, surfLessonsSchema]
            : localBusinessSchema
        )
      }}
    />
  );
}
