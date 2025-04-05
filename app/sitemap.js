import { getAllPosts } from '../lib/posts';

export default async function sitemap() {
  // Base URL of your website
  const baseUrl = 'https://www.vibesurfschool.com';
  
  // Get current date for lastModified
  const currentDate = new Date().toISOString();

  // Static routes
  const staticRoutes = [
    '',           // Home page
    '/about',
    '/contact',
    '/gallery',
    '/merchandise',
    '/locations',
    '/forecast',
    '/surfcams',
    '/vibe-surf-blog',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Get blog posts
  let blogEntries = [];
  try {
    const blogPosts = await getAllPosts();
    blogEntries = blogPosts.map(post => ({
      url: `${baseUrl}/vibe-surf-blog/${post.slug}`,
      lastModified: new Date(post.date).toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Combine static routes and blog posts
  return [...staticRoutes, ...blogEntries];
}
