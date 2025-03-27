import { getAllPosts } from '../../lib/posts';
import BlogCard from '../components/BlogCard';

export const metadata = {
  title: 'Blog - Vibe Surf School',
  description: 'Stay updated with surf conditions, events, and tips for surfing in Fort Lauderdale, Florida.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  
  return (
    <>
      {/* Hero Banner Section - with extra top margin to clear the header */}
      <div className="w-full bg-[#f8f9fa] mt-16 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-gray-800 text-center">Vibe Surf School Blog</h1>
          <p className="text-xl text-gray-600 text-center mt-4 max-w-3xl mx-auto">
            Stay updated with surf reports, local events, and surfing tips for Fort Lauderdale and South Florida
          </p>
        </div>
      </div>

      {/* Blog Posts Container */}
      <div className="container mx-auto px-4 py-12">
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
      </div>
    </>
  );
}