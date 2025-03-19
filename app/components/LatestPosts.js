import Link from 'next/link';
import { getAllPosts } from '../../lib/posts';
import BlogCard from './BlogCard';

export default async function LatestPosts() {
  const allPosts = await getAllPosts();
  const latestPosts = allPosts.slice(0, 3); // Get the 3 most recent posts
  
  if (latestPosts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No blog posts available yet. Check back soon!</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {latestPosts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}