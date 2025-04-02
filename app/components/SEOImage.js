'use client';

import Image from 'next/image';

export default function SEOImage({ src, alt, width, height, className, priority = false, sizes }) {
  // Calculate aspect ratio if both dimensions are provided
  const aspectRatio = width && height ? width / height : undefined;
  
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className || ''}
      loading={priority ? 'eager' : 'lazy'}
      priority={priority}
      sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      style={aspectRatio ? { aspectRatio } : undefined}
    />
  );
}
