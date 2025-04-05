import { getPostBySlug } from '../../../lib/posts';

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found - Vibe Surf School',
      description: 'The blog post you are looking for could not be found.',
    };
  }

  const title = `${post.title} | Vibe Surf Blog`;
  const description = post.excerpt || 'Read our latest surf tips, news, and stories from Fort Lauderdale, Florida.';
  
  return {
    title,
    description,
    keywords: `${post.title}, surf blog, Fort Lauderdale surfing, Florida surf tips, Vibe Surf School`,
    alternates: {
      canonical: `https://www.vibesurfschool.com/vibe-surf-blog/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.vibesurfschool.com/vibe-surf-blog/${params.slug}`,
      type: 'article',
      publishedTime: post.date,
      images: post.coverImage ? [
        {
          url: `https://www.vibesurfschool.com${post.coverImage}`,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [
        {
          url: 'https://www.vibesurfschool.com/images/surfing/Testimonials.png',
          width: 1200,
          height: 630,
          alt: 'Vibe Surf School Fort Lauderdale',
        }
      ],
    },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};
