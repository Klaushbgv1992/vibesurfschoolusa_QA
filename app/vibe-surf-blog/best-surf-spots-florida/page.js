import Image from 'next/image';
import Link from 'next/link';
import BlogSchemaGenerator from '../../components/BlogSchemaGenerator';

export const metadata = {
  title: '10 Best Surf Spots in Florida | Local\'s Guide | Vibe Surf School',
  description: 'Discover the best surf spots in Florida from local instructors. Our guide covers the top surf breaks from Fort Lauderdale to Miami Beach with tips for all skill levels.',
  keywords: 'best surf spots Florida, Florida surfing locations, surf breaks Fort Lauderdale, where to surf in Florida, beginner surf spots Miami, South Florida surfing guide',
  openGraph: {
    title: 'The 10 Best Surf Spots in Florida - Local\'s Guide',
    description: 'Insider tips on the best places to surf in Florida from the pros at Vibe Surf School. Learn when to go, what to expect, and how to find the perfect wave.',
    url: 'https://vibesurfschool.com/vibe-surf-blog/best-surf-spots-florida',
    siteName: 'Vibe Surf School',
    images: [
      {
        url: 'https://vibesurfschool.com/images/surfing/IMG_9109.JPG',
        width: 1200,
        height: 630,
        alt: 'Surfing in Florida at sunrise',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
};

export default function BestSurfSpotsFloridaBlog() {
  // Blog post data
  const post = {
    title: "10 Best Surf Spots in Florida: A Local's Guide",
    slug: "best-surf-spots-florida",
    date: "2025-03-15",
    author: "Klaus - Vibe Surf School",
    excerpt: "Discover the best surf spots in Florida from professional local instructors. Our comprehensive guide covers the top surf breaks for all skill levels.",
    coverImage: "https://vibesurfschool.com/images/surfing/IMG_9109.JPG",
    tags: ["Florida surf spots", "best surfing locations", "Pompano Beach surfing", "beginner surf spots"]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Blog Schema for SEO */}
      <BlogSchemaGenerator {...post} />
      
      {/* Hero Image */}
      <div className="relative w-full h-[50vh] min-h-[400px] max-h-[600px]">
        <Image
          src="/images/surfing/IMG_9109.JPG"
          alt="Surfing in Florida"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center max-w-4xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">10 Best Surf Spots in Florida: A Local's Guide</h1>
            <p className="text-xl text-white opacity-90">Discover the perfect waves from a local perspective</p>
          </div>
        </div>
      </div>
      
      {/* Blog Content */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center text-sm text-gray-600 mb-8">
          <span className="mr-4">Published: March 15, 2025</span>
          <span>By: Klaus - Vibe Surf School Instructor</span>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl text-gray-700 mb-8">
            As professional surf instructors based in Fort Lauderdale, we've spent countless hours riding waves across Florida's coastline. In this guide, we share our insider knowledge of the best surf spots in the Sunshine State, from beginner-friendly beaches to challenging breaks for experienced surfers.
          </p>
          
          <h2>1. Pompano Beach - Fort Lauderdale</h2>
          <p>
            Our home base at Pompano Beach is one of Florida's best-kept secrets for learning to surf. With its gentle, consistent waves and sandy bottom, it's the perfect spot for beginners. The beach features excellent facilities, including parking, restrooms, and nearby restaurants.
          </p>
          <p>
            <strong>Best for:</strong> Beginners, family-friendly lessons, consistent small waves
          </p>
          <p>
            <strong>When to go:</strong> Year-round, but winter months (November-March) typically offer the best conditions
          </p>
          
          <div className="my-8">
            <Image
              src="/images/location/pompano-beach.jpg"
              alt="Pompano Beach Surfing"
              width={800}
              height={500}
              className="rounded-lg"
            />
            <p className="text-sm text-gray-500 mt-2">Sunrise surfing at Pompano Beach - one of our favorite spots for beginners</p>
          </div>
          
          <h2>2. Dania Beach Pier</h2>
          <p>
            Located just south of Fort Lauderdale, Dania Beach offers more varied wave patterns that make it excellent for intermediate surfers. The pier creates unique wave formations that provide different surfing experiences depending on swell direction.
          </p>
          <p>
            <strong>Best for:</strong> Intermediate surfers, variety of wave types
          </p>
          <p>
            <strong>When to go:</strong> Winter months for larger swells, early mornings for less crowd
          </p>
          
          <h2>3. Sebastian Inlet - Space Coast</h2>
          <p>
            For those willing to travel a bit, Sebastian Inlet on Florida's Space Coast offers some of the state's most consistent and powerful waves. This spot has produced numerous professional surfers and features multiple breaks suitable for different skill levels.
          </p>
          <p>
            <strong>Best for:</strong> Experienced surfers, competitive surfing
          </p>
          <p>
            <strong>When to go:</strong> Winter months for biggest swells, but surfable year-round
          </p>
          
          <h2>4. Fort Lauderdale Beach</h2>
          <p>
            The main beach in Fort Lauderdale offers a great mix of conditions suitable for all skill levels. With its central location and numerous amenities, it's a convenient option for visitors staying in the heart of the city.
          </p>
          <p>
            <strong>Best for:</strong> All skill levels, convenient location
          </p>
          <p>
            <strong>When to go:</strong> Early mornings to avoid crowds, winter for best waves
          </p>
          
          <h2>5. Miami Beach</h2>
          <p>
            While not known for massive waves, Miami Beach can offer surprisingly good surfing conditions during winter swells. The iconic backdrop of South Beach adds to the experience, making it a must-visit for surf enthusiasts.
          </p>
          <p>
            <strong>Best for:</strong> Casual surfing, beginners during smaller swells
          </p>
          <p>
            <strong>When to go:</strong> During cold fronts in winter months
          </p>
          
          <h2>6. New Smyrna Beach</h2>
          <p>
            Often referred to as the "Shark Bite Capital of the World" (don't worry, incidents are rare!), New Smyrna Beach offers excellent waves and is consistently ranked among Florida's best surf spots. The inlet creates reliable breaks that work in various conditions.
          </p>
          <p>
            <strong>Best for:</strong> Intermediate to advanced surfers
          </p>
          <p>
            <strong>When to go:</strong> Year-round, with peak conditions in winter
          </p>
          
          <h2>7. Cocoa Beach - The Pier</h2>
          <p>
            Home to 11-time world champion Kelly Slater, Cocoa Beach is a legendary spot in Florida's surf culture. The pier area provides consistent waves suitable for all levels, with rental shops and surf schools nearby.
          </p>
          <p>
            <strong>Best for:</strong> All skill levels, surf culture experience
          </p>
          <p>
            <strong>When to go:</strong> Winter for best waves, summer for beginners
          </p>
          
          <h2>8. Jacksonville Beach</h2>
          <p>
            In Northeast Florida, Jacksonville Beach offers more consistent surf than many southern locations. Its exposure to the Atlantic means it catches more swell, making it a reliable option year-round.
          </p>
          <p>
            <strong>Best for:</strong> All skill levels, consistent conditions
          </p>
          <p>
            <strong>When to go:</strong> Hurricane season (with appropriate caution) for experienced surfers, year-round for beginners
          </p>
          
          <h2>9. Ponce Inlet</h2>
          <p>
            Near Daytona Beach, Ponce Inlet is known for its quality waves and less crowded lineup compared to other popular spots. The jetty creates favorable conditions that work with various swell directions.
          </p>
          <p>
            <strong>Best for:</strong> Intermediate to advanced surfers
          </p>
          <p>
            <strong>When to go:</strong> Year-round, autumn for clean conditions
          </p>
          
          <h2>10. Spanish House - Palm Beach</h2>
          <p>
            This reef break in Palm Beach County offers some of South Florida's most powerful waves when conditions align. It's a spot for experienced surfers who know how to read the ocean and handle challenging conditions.
          </p>
          <p>
            <strong>Best for:</strong> Advanced surfers only
          </p>
          <p>
            <strong>When to go:</strong> Winter swells, especially during north/northeast conditions
          </p>
          
          <h2>Tips for Surfing in Florida</h2>
          <ul>
            <li><strong>Check local forecasts</strong> - Use specialized surf forecasting tools to time your sessions</li>
            <li><strong>Go early</strong> - Florida's popular spots can get crowded, especially on weekends</li>
            <li><strong>Respect locals</strong> - Follow proper surf etiquette at all locations</li>
            <li><strong>Be aware of marine life</strong> - Florida waters are home to various marine creatures</li>
            <li><strong>Consider taking lessons</strong> - Even intermediate surfers can benefit from local knowledge</li>
          </ul>
          
          <h2>Ready to Catch Some Florida Waves?</h2>
          <p>
            Whether you're a complete beginner or an experienced surfer, Florida offers diverse surf experiences throughout the year. At Vibe Surf School, we provide lessons at some of the best spots mentioned above, with professional instructors who know these waters intimately.
          </p>
          <p>
            Ready to experience Florida's surf scene? <Link href="/contact" className="text-blue-600 hover:underline">Contact us</Link> to book a lesson or <Link href="/locations" className="text-blue-600 hover:underline">learn more about our locations</Link>.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg my-10">
            <h3 className="text-xl font-semibold mb-4">About the Author</h3>
            <div className="flex items-center">
              <Image
                src="/images/team/klaus.jpg"
                alt="Klaus - Surf Instructor"
                width={80}
                height={80}
                className="rounded-full mr-4"
              />
              <div>
                <p className="font-medium">Klaus has been surfing Florida's coastline for over 15 years and teaching for 10. As the founder of Vibe Surf School, he shares his passion for surfing with students from around the world.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Posts Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Explore More Surfing Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/vibe-surf-blog/beginners-guide-surfing" className="group">
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm transition-all group-hover:shadow-md">
                <div className="aspect-w-16 aspect-h-9 relative h-48">
                  <Image
                    src="/images/surfing/20242.jpg"
                    alt="Beginner's Guide to Surfing"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 group-hover:text-[#005d8e] transition-colors">Complete Beginner's Guide to Surfing</h4>
                  <p className="text-gray-600 mt-2">Everything you need to know before catching your first wave</p>
                </div>
              </div>
            </Link>
            <Link href="/vibe-surf-blog/best-surfboards-beginners" className="group">
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm transition-all group-hover:shadow-md">
                <div className="aspect-w-16 aspect-h-9 relative h-48">
                  <Image
                    src="/images/surfing/20243.jpg"
                    alt="Best Surfboards for Beginners"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 group-hover:text-[#005d8e] transition-colors">Best Surfboards for Beginners in 2025</h4>
                  <p className="text-gray-600 mt-2">Our top recommendations for your first surfboard</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
