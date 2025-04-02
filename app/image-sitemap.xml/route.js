export async function GET() {
  // Base URL of your website
  const baseUrl = 'https://vibesurfschool.com';

  // Define image categories
  const imageCategories = [
    {
      name: 'surfing',
      path: '/images/surfing',
      title: 'Surf Lessons in Fort Lauderdale',
      count: 30
    },
    {
      name: 'snorkeling-diving',
      path: '/images/snorkeling-diving',
      title: 'Snorkeling and Diving Adventures in Florida',
      count: 9
    },
    {
      name: 'paddleboarding',
      path: '/images/paddleboarding',
      title: 'Paddleboarding in Fort Lauderdale',
      count: 11
    },
    {
      name: 'merch',
      path: '/images/merch',
      title: 'Vibe Surf School Merchandise',
      count: 8
    }
  ];

  // Generate the image sitemap XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/gallery</loc>
    ${imageCategories.map(category => {
      let images = [];
      for (let i = 1; i <= category.count; i++) {
        // Use realistic image names based on the pattern in your gallery
        const imgName = category.name === 'surfing' 
          ? (i < 10 ? `20242${i}.jpg` : `2024${i}.jpg`) 
          : `${category.name}${i}.png`;
        
        images.push(`
    <image:image>
      <image:loc>${baseUrl}${category.path}/${imgName}</image:loc>
      <image:title>${category.title} - Image ${i}</image:title>
      <image:caption>Vibe Surf School ${category.name.replace('-', ' ')} in Fort Lauderdale, Florida</image:caption>
    </image:image>`);
      }
      return images.join('');
    }).join('')}
  </url>
  <url>
    <loc>${baseUrl}/locations</loc>
    <image:image>
      <image:loc>${baseUrl}/images/location/pompano-beach.jpg</image:loc>
      <image:title>Surf Lessons at Pompano Beach - Fort Lauderdale</image:title>
      <image:caption>Vibe Surf School's premier location at Pompano Beach, Fort Lauderdale</image:caption>
    </image:image>
    <image:image>
      <image:loc>${baseUrl}/images/location/dania-beach.jpg</image:loc>
      <image:title>Surf Lessons at Dania Beach - Fort Lauderdale</image:title>
      <image:caption>Vibe Surf School's location at Dania Beach, Fort Lauderdale</image:caption>
    </image:image>
    <image:image>
      <image:loc>${baseUrl}/images/location/george-south-africa.jpg</image:loc>
      <image:title>Surf Lessons in George, South Africa</image:title>
      <image:caption>Vibe Surf School's partner location in George, South Africa</image:caption>
    </image:image>
  </url>
</urlset>`;

  // Return the XML with proper content type
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
