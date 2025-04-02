'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function OptimizedHero({ src, alt, priority = true }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Handle image load events
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="relative w-full h-full">
      {/* Low quality placeholder */}
      <div 
        className={`absolute inset-0 bg-gray-200 blur-xl transform scale-105 transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundColor: '#005d8e' }}
      />
      
      {/* Main image with priority loading */}
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleImageLoad}
        priority={priority}
        sizes="100vw"
        quality={85}
      />
    </div>
  );
}
