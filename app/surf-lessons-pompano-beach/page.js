import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Surf Lessons in Pompano Beach | Vibe Surf School Florida',
  description: 'Learn to surf at Pompano Beach with Vibe Surf School. Perfect beginner-friendly waves, professional instructors, and all equipment provided. Book your lesson today!',
  keywords: 'Pompano Beach surf lessons, learn to surf Pompano Beach, surfing lessons Florida, beginner surf Pompano, surf school near Pompano Beach',
  openGraph: {
    title: 'Surf Lessons at Pompano Beach - Vibe Surf School',
    description: 'Experience the best surfing conditions for beginners at Pompano Beach with Vibe Surf School. Professional instruction in a beautiful, safe environment.',
    url: 'https://vibesurfschool.com/surf-lessons-pompano-beach',
    siteName: 'Vibe Surf School',
    images: [
      {
        url: 'https://vibesurfschool.com/images/location/pompano-beach.jpg',
        width: 1200,
        height: 630,
        alt: 'Surf Lessons at Pompano Beach',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function PompanoBeachPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 py-28 px-4">
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-blue-600 to-blue-900">
          <Image 
            src="/images/location/pompano-beach.jpg" 
            alt="Surf Lessons at Pompano Beach"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Surf Lessons at Pompano Beach</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Perfect beginner-friendly waves and expert instruction in a beautiful setting
          </p>
          <div className="mt-10">
            <a 
              href="https://vibesurfschool.setmore.com/pompanobeach" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white font-medium py-4 px-8 rounded-md transition-colors shadow-md text-lg"
            >
              Book Your Pompano Beach Lesson
            </a>
          </div>
        </div>
      </section>
      
      {/* Location Specific Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Pompano Beach is Perfect for Surf Lessons</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <Image 
                  src="/images/surfing/20241.jpg"
                  alt="Surfing at Pompano Beach" 
                  width={500} 
                  height={375}
                  className="rounded-lg shadow-md w-full h-auto"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">The Premier Surf Spot in Fort Lauderdale</h3>
                <p className="text-gray-700 mb-4">
                  Pompano Beach offers ideal conditions for learning how to surf, especially for beginners. With its gentle, consistent waves and sandy bottom, it provides the perfect environment for your first surfing experience.
                </p>
                <p className="text-gray-700 mb-4">
                  Our main surf lesson location at Pompano Beach features:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Reliable, beginner-friendly waves year-round</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Clean, clear water with excellent visibility</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Lifeguard-supervised beach for added safety</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Convenient amenities including parking and restrooms</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm mb-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Pompano Beach Surf Lesson Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-[#005d8e] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">Duration</h4>
                  <p className="text-gray-600">60-minute lessons with approximately 45 minutes of water time</p>
                </div>
                <div className="text-center">
                  <div className="bg-[#005d8e] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">Group Size</h4>
                  <p className="text-gray-600">Small groups (max 4 students per instructor) or private lessons</p>
                </div>
                <div className="text-center">
                  <div className="bg-[#005d8e] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">Skill Levels</h4>
                  <p className="text-gray-600">All levels welcome, from complete beginners to intermediate surfers</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Catch Your First Wave at Pompano Beach?</h3>
              <p className="text-gray-700 mb-6">Join us for a surf lesson at one of Fort Lauderdale's most beautiful beaches. Our expert instructors will have you standing and riding waves in no time!</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
                  href="https://vibesurfschool.setmore.com/pompanobeach" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white font-medium py-3 px-6 rounded-md transition-colors shadow-md"
                >
                  Book at Pompano Beach
                </a>
                <Link 
                  href="/contact" 
                  className="inline-block bg-white hover:bg-gray-100 text-[#005d8e] font-medium py-3 px-6 rounded-md border border-[#005d8e] transition-colors shadow-md"
                >
                  Ask About Pompano Lessons
                </Link>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Directions to Our Pompano Beach Location</h3>
              <p className="text-gray-700 mb-4">
                Find us at <strong>50 N Ocean Blvd, Pompano Beach, FL 33062</strong>. Look for the Vibe Surf School tent and flags near the Hillsboro Lighthouse. Ample parking is available in the public lot.
              </p>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.5991091068395!2d-80.0807356!3d26.2313669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d8db2a495e5a0d%3A0x8d5d5e7e43c3ee30!2s50%20N%20Ocean%20Blvd%2C%20Pompano%20Beach%2C%20FL%2033062!5e0!3m2!1sen!2sus!4v1649037929841!5m2!1sen!2sus" 
                  width="600" 
                  height="450" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
