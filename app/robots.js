export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', 
          '/_next/',
          '/private/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/images/', '/gallery/'],
      },
    ],
    sitemap: [
      'https://www.vibesurfschool.com/sitemap.xml',
      'https://www.vibesurfschool.com/image-sitemap.xml',
    ],
    host: 'https://www.vibesurfschool.com',
  }
}
