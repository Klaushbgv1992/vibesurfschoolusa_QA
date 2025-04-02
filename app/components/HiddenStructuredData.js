'use client';

import React from 'react';

export default function HiddenStructuredData() {
  // Generate review schema for SEO benefits without displaying duplicate reviews
  const generateReviewSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Vibe Surf School",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "50 N Ocean Blvd",
        "addressLocality": "Pompano Beach",
        "addressRegion": "FL",
        "postalCode": "33062",
        "addressCountry": "US"
      },
      "telephone": "+1-954-555-1234",
      "priceRange": "$$",
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "26.2313669",
        "longitude": "-80.0807356"
      },
      "url": "https://vibesurfschool.com",
      "image": "https://vibesurfschool.com/images/vibe-surfschool-logo.svg",
      "review": [
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "Sarah Johnson"
          },
          "datePublished": "2025-01-20",
          "reviewBody": "Best surf lessons in Fort Lauderdale! As a complete beginner, I was nervous about trying surfing, but the instructors made it so fun and easy to learn. Great location at Pompano Beach with perfect waves for learning."
        },
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "Michael Rodriguez"
          },
          "datePublished": "2025-02-15",
          "reviewBody": "Had an amazing experience learning to surf at Pompano Beach with Klaus. The instruction was clear, patient, and by the end of our 60-minute lesson, everyone in our group was able to stand up and ride a wave! Highly recommend for families."
        },
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "David Chen"
          },
          "datePublished": "2024-12-12",
          "reviewBody": "My kids (8 and 10) took surf lessons here and had a blast! The instructors were so good with children, making sure they were safe while still having fun. They provided all the equipment and even took photos of them standing on the waves. Would book again!"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": "33",
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    return schema;
  };

  // Return only the schema without any visible UI elements
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateReviewSchema())
      }}
    />
  );
}
