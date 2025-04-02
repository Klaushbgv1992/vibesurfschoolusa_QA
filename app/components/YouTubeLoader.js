'use client';

import { useState } from 'react';

export default function YouTubeLoader({ videoId, title }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full h-full rounded-md">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#005d8e]"></div>
        </div>
      )}
      <iframe 
        src={`https://www.youtube.com/embed/${videoId}?si=F6U06QKpND0Myw-6`}
        className="object-cover w-full h-full rounded-md"
        title={title || "YouTube Video"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
