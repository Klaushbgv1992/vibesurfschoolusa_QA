'use client';

import React from 'react';

export default function LocalBusinessReviews() {
  // Reviews data with name, rating, text, date
  const reviews = [
    {
      name: "Michael Rodriguez",
      rating: 5,
      text: "Had an amazing experience learning to surf at Pompano Beach with Klaus. The instruction was clear, patient, and by the end of our 60-minute lesson, everyone in our group was able to stand up and ride a wave! Highly recommend for families.",
      date: "2025-02-15"
    },
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Best surf lessons in Fort Lauderdale! As a complete beginner, I was nervous about trying surfing, but the instructors made it so fun and easy to learn. Great location at Pompano Beach with perfect waves for learning.",
      date: "2025-01-20"
    },
    {
      name: "David Chen",
      rating: 5,
      text: "My kids (8 and 10) took surf lessons here and had a blast! The instructors were so good with children, making sure they were safe while still having fun. They provided all the equipment and even took photos of them standing on the waves. Would book again!",
      date: "2024-12-12"
    },
    {
      name: "Amanda Williams",
      rating: 5,
      text: "I've tried several surf schools in Florida, and Vibe Surf School is by far the best. The personalized attention and expertise of the instructors made all the difference. Worth every penny for quality instruction in a beautiful setting.",
      date: "2024-11-28"
    }
  ];

  // Generate review schema
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
      "review": reviews.map(review => ({
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": review.name
        },
        "datePublished": review.date,
        "reviewBody": review.text
      })),
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": reviews.length.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    return schema;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateReviewSchema())
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500 text-sm">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <p className="text-gray-700 mb-3">{review.text}</p>
            <p className="font-medium text-gray-900">- {review.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
