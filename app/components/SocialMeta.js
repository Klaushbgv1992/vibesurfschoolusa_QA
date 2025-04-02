'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

export default function SocialMeta({ title, description, image, type = 'website' }) {
  const pathname = usePathname();
  const baseUrl = 'https://vibesurfschool.com';
  const url = `${baseUrl}${pathname}`;
  const defaultImage = `${baseUrl}/images/surfing/Testimonials.png`;
  
  // Use defaults if values aren't provided
  const metaTitle = title || 'Vibe Surf School - Fort Lauderdale, Florida';
  const metaDescription = description || 'Learn to surf with experienced instructors at Vibe Surf School in Fort Lauderdale. Professional surf lessons for all skill levels in a fun, safe environment.';
  const metaImage = image || defaultImage;

  return (
    <Head>
      {/* Facebook and OpenGraph */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Vibe Surf School" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:site" content="@vibesurfschool" /> {/* Add actual handle if available */}
      
      {/* Additional Facebook tags */}
      <meta property="fb:app_id" content="your-fb-app-id" /> {/* Add actual FB App ID if available */}
      
      {/* Additional SEO meta tags */}
      <meta name="author" content="Vibe Surf School" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
    </Head>
  );
}
