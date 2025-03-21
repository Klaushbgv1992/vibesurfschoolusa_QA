import HeroSection from './components/HeroSection';
import PropertyInfo from './components/PropertyInfo';
import TestimonialSection from './components/TestimonialSection';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <HeroSection />
      
      {/* Welcome Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Vibe Beach House</h2>
              <p className="text-lg text-gray-700 mb-6">
                Nestled in the picturesque coastal village of Herolds Bay, our luxury guesthouse offers an unforgettable stay with breathtaking ocean views, modern amenities, and a tranquil atmosphere.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Whether you&apos;re seeking a peaceful getaway, a family vacation, or a romantic retreat, Vibe Beach House provides the perfect setting for creating lasting memories on the stunning Garden Route.
              </p>
              <Link href="/about" className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white font-medium py-3 px-8 rounded-sm transition-colors shadow-sm">
                Discover Our Story
              </Link>
            </div>
            <div className="w-full md:w-1/2 relative h-[400px] md:h-[500px]">
              <div className="absolute inset-0 rounded-md shadow-lg overflow-hidden">
                <video 
                  src="/images/dronefootage.mp4"
                  className="object-cover w-full h-full rounded-md"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <PropertyInfo />
      
      {/* Experience Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Experience Luxury Living</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Immerse yourself in the ultimate luxury experience with our premium amenities and stunning location
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative h-64">
                <Image
                  src="/images/exterior-views/6.jpg"
                  alt="Pool and Ocean View"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ultimate Braai Living</h3>
                <p className="text-gray-700 mb-4">
                Make the most of Herolds Bay’s pleasant climate with our spacious covered braai area and private swimming pool.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Covered braai area</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Private swimming pool</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Easy Indoor-Outdoor Flow for hosting</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative h-64">
                <Image
                  src="/images/interior-views/10.jpg"
                  alt="Luxury Interior"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Modern Comforts</h3>
                <p className="text-gray-700 mb-4">
                  Enjoy a perfect blend of luxury and comfort with our thoughtfully designed living spaces and premium amenities.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">High-end furnishings throughout</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Fully equipped modern kitchen</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Fast WiFi and entertainment options</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative h-64">
                <Image
                  src="/images/herolds-bay-surroundings/DSC_2026.JPG"
                  alt="Herolds Bay Beach"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Prime Location</h3>
                <p className="text-gray-700 mb-4">
                  Perfectly positioned to explore the beauty of Herolds Bay and the Garden Route, with easy access to beaches and attractions.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">5-min drive to the beach & Oubaai golfing</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Close to George Airport (15 min)</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Near restaurants and attractions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/gallery" className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white px-8 py-4 rounded-sm text-lg font-semibold transition-colors shadow-md">
              Explore Our Gallery
            </Link>
          </div>
        </div>
      </section>
      
      <TestimonialSection />
      
      {/* Call to Action */}
      <section className="py-20 bg-[#005d8e] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready for Your Luxury Getaway?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            Book your stay at Vibe Beach House today and experience the perfect blend of luxury, comfort, and natural beauty in Herolds Bay.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href="https://www.airbnb.com/rooms/1185679450503007200?source_impression_id=p3_1742350524_P3ntnWSMNQoPAbvn" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#00486e] hover:bg-[#003a59] text-white px-8 py-4 rounded-sm text-lg font-semibold transition-colors shadow-md"
            >
              Book On Airbnb
            </a>
            <Link 
              href="/contact" 
              className="bg-white hover:bg-gray-100 text-[#005d8e] px-8 py-4 rounded-sm text-lg font-semibold transition-colors shadow-md"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}