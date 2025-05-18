import { getAllPosts } from '../../lib/posts';
import BlogCard from '../components/BlogCard';
import Image from 'next/image';

export const metadata = {
  title: 'Vibe Surf Blog - Vibe Surf School',
  description: 'Stay updated with surf conditions, events, and tips for surfing in Fort Lauderdale, Florida.',
};

export default async function VibeSurfBlogPage() {
  const posts = await getAllPosts();
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 py-28 px-4">
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-blue-600 to-blue-900">
          <Image 
            src="/images/surfing/Testimonials.png" 
            alt="Blog Hero Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Vibe Surf Blog</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Stay updated with surf reports, local events, and surfing tips for Fort Lauderdale and South Florida
          </p>
        </div>
      </section>

      {/* Blog Posts Container */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600">No blog posts available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
          
          {/* Book Now Section */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Experience the Waves Yourself?</h3>
            <a 
              href="/booking"
              className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white font-medium py-4 px-8 rounded-md transition-colors shadow-md text-lg"
            >
              Book Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
