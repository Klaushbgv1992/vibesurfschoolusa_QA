export default async function sitemap() {
  // Base URL of your website
  const baseUrl = 'https://vibebeachhouse.com';

  // Get all static routes
  const staticRoutes = [
    '',          // Home page
    '/about',    
    '/contact',
    '/gallery',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // For dynamic routes like blog posts, you would fetch them and add them here
  // This is a basic example - you may need to adjust based on your data source
  let blogPosts = [];
  try {
    // You would replace this with your actual blog post fetching logic
    // For example, if you store blog posts in files or a database
    // This is just a placeholder
    
    // blogPosts = await fetchBlogPosts();
    // blogPosts = blogPosts.map(post => ({
    //   url: `${baseUrl}/blog/${post.slug}`,
    //   lastModified: post.updatedAt || post.createdAt,
    //   changeFrequency: 'weekly',
    //   priority: 0.7,
    // }));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return [
    ...staticRoutes,
    ...blogPosts,
  ];
}
