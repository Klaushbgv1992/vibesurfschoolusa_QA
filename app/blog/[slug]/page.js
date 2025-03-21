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
      title: 'Post Not Found - Vibe Beach House Blog',
      description: 'The blog post you are looking for does not exist.',
    };
  }
  
  return {
    title: `${post.title} - Vibe Beach House Blog`,
    description: post.excerpt || `Read about ${post.title} on the Vibe Beach House blog.`,
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
          <h2 className="text-2xl font-bold mb-4 text-black">Stay at Vibe Beach House</h2>
          <p className="mb-4 text-gray-700">
            Planning to visit Herolds Bay? Book your stay at our beautiful Vibe Beach House. 
            With 3 bedrooms, a swimming pool, and stunning views, it's the perfect base for 
            exploring all that the Garden Route has to offer.
          </p>
          <Link
            href="https://www.airbnb.com/rooms/1185679450503007200?source_impression_id=p3_1742350524_P3ntnWSMNQoPAbvn"
            className="inline-block bg-[#005d8e] text-white px-6 py-2 rounded font-semibold hover:bg-[#00486e] transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book Your Stay
          </Link>
        </div>
      </div>
    </div>
  );
}