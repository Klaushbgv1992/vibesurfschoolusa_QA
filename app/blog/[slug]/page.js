import { getPostBySlug, getAllPosts } from '../../../lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  
  return {
    title: `${post.title} - Vibe Guesthouse Blog`,
    description: post.excerpt || `Read about ${post.title} on the Vibe Guesthouse blog.`,
  };
}

export default async function BlogPost({ params }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-6">Post Not Found</h1>
        <p className="mb-6">The blog post you're looking for doesn't exist.</p>
        <Link href="/blog" className="text-amber-500 hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-3xl mx-auto">
        {post.coverImage && (
          <div className="relative w-full h-80 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-8">
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</time>
        </div>
        
        <div className="prose max-w-none">
          <MDXRemote source={post.content} />
        </div>
        
        <div className="mt-12 p-6 bg-amber-50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Stay at Vibe Guesthouse</h2>
          <p className="mb-4">
            Planning to visit Herolds Bay? Book your stay at our beautiful Vibe Guesthouse. 
            With 3 bedrooms, a swimming pool, and stunning views, it's the perfect base for 
            exploring all that the Garden Route has to offer.
          </p>
          <Link
            href="https://www.airbnb.com/rooms/1185679450503007200?source_impression_id=p3_1742350524_P3ntnWSMNQoPAbvn"
            className="inline-block bg-amber-500 text-white px-6 py-2 rounded font-semibold hover:bg-amber-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book Your Stay
          </Link>
        </div>
      </article>
    </div>
  );
}