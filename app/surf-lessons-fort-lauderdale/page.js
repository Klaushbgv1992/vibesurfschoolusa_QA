import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Surf Lessons in Fort Lauderdale | Vibe Surf School',
  description: 'Learn to surf in Fort Lauderdale with professional instructors from Vibe Surf School. Beginner-friendly lessons at Pompano Beach and Dania Beach for all ages.',
  keywords: 'Fort Lauderdale surf lessons, surfing Pompano Beach, beginner surf lessons Florida, Dania Beach surfing, learn to surf Fort Lauderdale, surf school near me',
  openGraph: {
    title: 'Best Surf Lessons in Fort Lauderdale, Florida',
    description: 'Join Vibe Surf School for professional surf lessons in Fort Lauderdale. Perfect for beginners and all skill levels!',
    url: 'https://vibesurfschool.com/surf-lessons-fort-lauderdale',
    siteName: 'Vibe Surf School',
    images: [
      {
        url: 'https://vibesurfschool.com/images/surfing/Testimonials.png',
        width: 1200,
        height: 630,
        alt: 'Surf Lessons in Fort Lauderdale',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function FortLauderdalePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 py-28 px-4">
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-blue-600 to-blue-900">
          <Image 
            src="/images/surfing/IMG_9109.JPG" 
            alt="Surf Lessons in Fort Lauderdale"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Surf Lessons in Fort Lauderdale</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Learn to ride the waves with the best surf instructors in South Florida
          </p>
          <div className="mt-10">
            <a 
              href="/booking"
              className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white font-medium py-4 px-8 rounded-md transition-colors shadow-md text-lg"
            >
              Book Your Lesson Now
            </a>
          </div>
        </div>
      </section>
      
      {/* Local Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">The Best Place to Learn Surfing in Florida</h2>
            <p className="text-lg text-gray-700 mb-8">
              Fort Lauderdale offers ideal conditions for learning to surf, with gentle waves, warm water year-round, and beautiful sandy beaches. Our professional surf instructors at Vibe Surf School have years of experience teaching surfers of all ages and skill levels.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Why Fort Lauderdale is Perfect for Beginners</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Gentle, consistent waves perfect for learning</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Sandy bottom beaches without dangerous reefs</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Warm water temperatures year-round (72-86°F)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Lifeguard-supervised beaches for extra safety</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Our Local Surf Spots</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-gray-700"><strong>Pompano Beach</strong> - Our main location with perfect beginner waves</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-gray-700"><strong>Dania Beach</strong> - Great for intermediate surfers with varied waves</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-gray-700"><strong>Fort Lauderdale Beach</strong> - Central location with amenities nearby</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link 
                href="/locations" 
                className="inline-block text-[#005d8e] hover:text-[#00486e] font-medium underline transition-colors"
              >
                Learn more about our surf lesson locations
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Catch Your First Wave?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Join us for surf lessons in Fort Lauderdale and experience the thrill of riding waves in the beautiful waters of South Florida. Our instructors are certified, experienced, and passionate about teaching surfing to students of all ages and abilities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/booking"
                className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white font-medium py-4 px-8 rounded-md transition-colors shadow-md text-lg"
              >
                Book a Lesson Now
              </a>
              <Link 
                href="/contact" 
                className="inline-block bg-white hover:bg-gray-100 text-[#005d8e] font-medium py-4 px-8 rounded-md border border-[#005d8e] transition-colors shadow-md text-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
