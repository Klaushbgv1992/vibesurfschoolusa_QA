import HeroSection from './components/HeroSection';
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
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Vibe Surf School</h2>
              <p className="text-lg text-gray-700 mb-6">
                Learn To Surf Fort Lauderdale Florida. Vibe Surf School - Stoked is our Vibe!
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Vibe Surf School is a place where you become part of the thrilling spirit of the ocean. We are one of the leading surf schools in South Florida, and we are committed to ensuring that your journey in surfing is memorable.
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
      
      {/* Experience Section - Surf With Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Surf With Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn to surf with our expert instructors in a fun, safe environment with lessons for all skill levels
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative h-64">
                <Image
                  src="/images/surfing/IMG_9138.JPG"
                  alt="Individual Surf Lessons"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Individual Surf Lessons</h3>
                <p className="text-gray-700 mb-4">
                  Experience personalized surfing with our Individual Surf Lessons, tailored to your skill level and goals with certified instructors to fast-track your progress.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Personalized instruction</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">All equipment provided</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">$100 per person</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative h-64">
                <Image
                  src="/images/surfing/IMG_6216.jpg"
                  alt="Group Surf Lessons"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Group Surf Lessons</h3>
                <p className="text-gray-700 mb-4">
                  Enjoy surfing with friends or family in our Group Surf Lessons in a fun, collaborative environment. All necessary equipment is provided.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Fun group environment</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Perfect for friends & family</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">$75 per person</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative h-64">
                <Image
                  src="/images/surfing/IMG_0047.jpg"
                  alt="Surf Camps"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Surf Camps</h3>
                <p className="text-gray-700 mb-4">
                  Our Kids Surf Camp offers a safe and exciting environment to learn ocean safety, surfing etiquette, and basic skills in a fun, educational setting.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Ocean safety education</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Surfing etiquette & basic skills</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="text-green-500 mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Beach games & surf lessons</span>
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
      
      {/* Adventure Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Adventure With Us</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Beyond surfing, Vibe Surf School offers exhilarating adventures in the ocean. Take advantage of our guided stand-up paddleboarding tours or dive into our snorkeling or scuba diving adventures to discover vibrant marine life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Adventure 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative h-64">
                <Image
                  src="/images/snorkeling-diving/Guided-Reef-Shore-Dive-Pompano-Beach.webp"
                  alt="Scuba Diving Adventures"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Scuba Diving Adventures</h3>
                <p className="text-gray-700 mb-4">
                  Guided reef shore dive in Pompano Beach or Fort Lauderdale offers a unique opportunity to explore some of Florida's most spectacular underwater environments.
                </p>
                <p className="text-gray-900 font-semibold mt-4">$110 per person</p>
              </div>
            </div>
            
            {/* Adventure 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative h-64">
                <Image
                  src="/images/snorkeling-diving/Guided-Reef-Snorkeling-Tour-Fort-Lauderdale.webp"
                  alt="Snorkeling Adventures"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Snorkeling Adventures</h3>
                <p className="text-gray-700 mb-4">
                  Dive into adventure with our Guided Reef snorkeling tour in Pompano Beach! Embark on an extraordinary underwater journey around the vibrant reef system.
                </p>
                <p className="text-gray-900 font-semibold mt-4">$65 per person</p>
              </div>
            </div>
            
            {/* Adventure 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="relative h-64">
                <Image
                  src="/images/paddleboarding/paddleboarding_florida5.webp"
                  alt="Stand Up Paddleboarding"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Stand Up Paddleboarding</h3>
                <p className="text-gray-700 mb-4">
                  Looking for an exciting experience? Join our Stand Up Paddleboard (SUP) Tours along the stunning coastline of Pompano Beach, Fort Lauderdale, and Dania Beach's Mangroves.
                </p>
                <p className="text-gray-900 font-semibold mt-4">$75 per person</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* What Our Clients Say - Testimonials */}
      <TestimonialSection />
      
      {/* Call to Action */}
      <section className="py-20 bg-[#005d8e] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Catch Some Waves?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            Book your surf lesson with Vibe Surf School today and experience the thrill of surfing in Fort Lauderdale, Florida.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href="https://vibesurfschool.setmore.com/fortlauderdale" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#00486e] hover:bg-[#003a59] text-white px-8 py-4 rounded-sm text-lg font-semibold transition-colors shadow-md"
            >
              Book A Lesson
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