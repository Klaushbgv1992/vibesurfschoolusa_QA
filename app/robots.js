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
          '/*.json$',
          '/*.xml$',
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
      'https://vibesurfschool.com/sitemap.xml',
      'https://vibesurfschool.com/image-sitemap.xml',
    ],
    host: 'https://vibesurfschool.com',
  }
}
