// This approach avoids the need for "use client" by using Server Components
// and properly handling data fetching

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts } from '../../../lib/posts';

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found - Vibe Surf School Blog',
      description: 'The blog post you are looking for does not exist.',
    };
  }
  
  return {
    title: `${post.title} - Vibe Surf School Blog`,
    description: post.excerpt || `Read about ${post.title} on the Vibe Surf School blog.`,
  };
}

// The main page component
export default async function BlogPost({ params }) {
  // First validate slug exists
  if (!params?.slug) {
    notFound();
  }
  
  // Fetch post data
  const post = await getPostBySlug(params.slug);
  
  // Return 404 page if post doesn't exist
  if (!post) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back button - more prominent styled as a button */}
        <Link 
          href="/blog" 
          className="mb-8 inline-flex items-center px-4 py-2 bg-[#005d8e] text-white rounded hover:bg-[#00486e] transition-colors"
        >
          ← Back to Blog
        </Link>
        
        {/* Featured image */}
        {post.coverImage && (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        )}
        
        {/* Post title - changed to black */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">{post.title}</h1>
        
        {/* Post date */}
        <div className="text-gray-600 mb-8">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        
        {/* Post content - using a custom class that we'll define in globals.css */}
        <div 
          className="blog-content prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Booking CTA */}
        <div className="mt-12 p-6 bg-[#eef7fc] rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-black">Learn to Surf in Fort Lauderdale</h2>
          <p className="text-gray-800 mb-6">
            Planning to visit Florida? Book a surf lesson with Vibe Surf School in Fort Lauderdale. 
            Our professional instructors will help you catch your first wave!
          </p>
          <Link
            href="/booking"
            className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white px-5 py-3 rounded-lg font-medium transition-colors shadow-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book Your Lesson
          </Link>
        </div>
      </div>
    </div>
  );
}