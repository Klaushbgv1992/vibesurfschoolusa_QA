import { getAllPosts } from '../lib/posts';

export async function GET() {
  // Base URL of your website
  const baseUrl = 'https://vibesurfschool.com';

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
  ];

  // Get blog posts
  let blogPosts = [];
  try {
    blogPosts = await getAllPosts();
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Generate sitemap XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes.map(route => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'monthly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>
  `).join('')}
  ${blogPosts.map(post => `
  <url>
    <loc>${baseUrl}/vibe-surf-blog/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  `).join('')}
</urlset>`;

  // Return the XML with proper content type
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
