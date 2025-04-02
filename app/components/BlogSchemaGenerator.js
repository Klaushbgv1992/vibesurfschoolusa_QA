'use client';

import React from 'react';

export default function BlogSchemaGenerator({ title, slug, date, author, excerpt, coverImage, tags }) {
  if (!title) return null;
  
  // Format date to ISO string if it exists
  const datePublished = date ? new Date(date).toISOString() : new Date().toISOString();
  
  // Create the blog post schema
  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt || '',
    image: coverImage || 'https://vibesurfschool.com/images/surfing/Testimonials.png',
    datePublished: datePublished,
    dateModified: date ? new Date(date).toISOString() : datePublished,
    author: {
      '@type': 'Person',
      name: author || 'Vibe Surf School',
      url: 'https://vibesurfschool.com/about'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vibe Surf School',
      logo: {
        '@type': 'ImageObject',
        url: 'https://vibesurfschool.com/images/vibe-surfschool-logo.svg'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://vibesurfschool.com/vibe-surf-blog/${slug || ''}`
    },
    keywords: [
      'surf lessons',
      'Fort Lauderdale surfing',
      'learn to surf',
      'Florida surf school',
      ...(tags || [])
    ].join(', ')
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(blogPostSchema)
      }}
    />
  );
}
