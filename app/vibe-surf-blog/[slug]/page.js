import { getPostBySlug } from '../../../lib/posts';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  // Format date for display
  const displayDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gray-900 py-20 px-4">
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-blue-600 to-blue-900">
          {post.coverImage ? (
            <Image 
              src={post.coverImage} 
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <Image 
              src="/images/surfing/Testimonials.png" 
              alt="Blog Hero Background"
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{post.title}</h1>
          <p className="text-white/80 mb-6">{displayDate}</p>
          <Link 
            href="/vibe-surf-blog" 
            className="inline-flex items-center text-white hover:text-blue-200 transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <article className="prose prose-lg max-w-3xl mx-auto">
            {post.excerpt && (
              <div className="bg-blue-50 p-6 rounded-lg mb-8 text-gray-700 italic">
                {post.excerpt}
              </div>
            )}
            
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
          
          {/* Author Section */}
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">About Vibe Surf School</h3>
            <p className="text-gray-600 mb-6">
              Vibe Surf School provides professional surf lessons in Fort Lauderdale, Florida. 
              Whether you're a beginner or looking to advance your skills, our experienced 
              instructors are dedicated to helping you enjoy the waves safely.
            </p>
            
            {/* CTA */}
            <div className="text-center mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Experience the Waves Yourself?</h3>
              <a 
                href="https://vibesurfschool.setmore.com/fortlauderdale" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white font-medium py-3 px-8 rounded-md transition-colors shadow-md"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
