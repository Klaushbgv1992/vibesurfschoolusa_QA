import { getAllPosts } from '../../lib/posts';
import BlogCard from '../components/BlogCard';

export const metadata = {
  title: 'Blog - Vibe Beach House',
  description: 'Stay updated with local events, attractions, and news from Herolds Bay and the Garden Route.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12 text-center">Vibe Beach House Blog</h1>
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
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
  );
}