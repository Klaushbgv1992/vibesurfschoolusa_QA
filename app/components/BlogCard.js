"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function BlogCard({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.coverImage && (
        <div className="relative h-48 w-full">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={80}
            loading="lazy"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="text-gray-600 text-sm mb-2">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        
        <h3 className="text-xl font-bold mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-[#005d8e] transition-colors">
            {post.title}
          </Link>
        </h3>
        
        {post.excerpt && (
          <p className="text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>
        )}
        
        <Link href={`/blog/${post.slug}`} className="text-[#005d8e] font-medium hover:underline">
          Read More →
        </Link>
      </div>
    </div>
  );
}