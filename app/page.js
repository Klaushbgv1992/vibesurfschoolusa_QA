import HeroSection from './components/HeroSection';
import TestimonialSection from './components/TestimonialSection';
import Image from 'next/image';
import Link from 'next/link';
import YouTubeVideo from './components/YouTubeVideo';
import FAQ from './components/FAQ';

export const metadata = {
  title: 'Vibe Surf School - Surf Lessons in Dania Beach, Pompano Beach & Sunny Isles Beach, Florida',
  description: 'Learn to surf with professional instructors at Vibe Surf School in Dania Beach, Pompano Beach & Sunny Isles Beach. We offer individual and group lessons, paddleboarding, snorkeling, and scuba adventures for all skill levels.',
  keywords: 'surf lessons, Dania Beach, Pompano Beach, Sunny Isles Beach, learn to surf Florida, beginner surfing, group surf lessons, paddleboarding, snorkeling, scuba diving, Florida surf adventures',
  openGraph: {
    title: 'Vibe Surf School - Dania Beach, Pompano Beach & Sunny Isles Beach, Florida',
    description: 'Professional surf lessons for all skill levels in Dania Beach, Pompano Beach & Sunny Isles Beach. Book your adventure today!',
    url: 'https://vibesurfschool.com',
    siteName: 'Vibe Surf School',
    images: [
      {
        url: 'https://vibesurfschool.com/images/surfing/Testimonials.png',
        width: 1200,
        height: 630,
        alt: 'Vibe Surf School',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function Home() {
  // FAQ data for the homepage
  const faqQuestions = [
    {
      question: "Do I need any previous experience to take surf lessons?",
      answer: "No previous experience is required! Our surf lessons are designed for all skill levels, from complete beginners to intermediate surfers looking to improve their technique."
    },
    {
      question: "What age groups do you teach?",
      answer: "We teach surfers of all ages, from children as young as 5 years old to adults. We offer specialized lessons for kids and families, ensuring everyone has a safe and fun experience."
    },
    {
      question: "What should I bring to my surf lesson?",
      answer: "Just bring yourself, a swimsuit, a towel, and sunscreen. We provide all the necessary equipment including surfboards. Don't forget to bring water to stay hydrated!"
    },
    {
      question: "How long are the surf lessons?",
      answer: "Our standard surf lessons are 60 minutes in duration, which includes beach instruction, water safety, and plenty of time in the water practicing. Private lessons and group sessions are available."
    },
    {
      question: "Is it safe to learn surfing at our beaches?",
      answer: "Yes! Dania Beach, Pompano Beach, and Sunny Isles Beach offer ideal conditions for learning to surf with gentle waves and sandy beaches. Our instructors are certified in water safety and first aid, and we always check conditions before lessons."
    }
  ];

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
                Learn To Surf in Dania Beach, Pompano Beach & Sunny Isles Beach, Florida. Vibe Surf School - Stoked is our Vibe!
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Located in the vibrant Greater Fort Lauderdale area and just minutes from Miami, we serve the beautiful coastline of Southern Florida. Our pristine beaches offer the perfect conditions for beginners and experienced surfers alike.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Vibe Surf School is a place where you become part of the thrilling spirit of the ocean. We are one of the leading surf schools in South Florida, and we are committed to ensuring that your journey in surfing is memorable whether you're a local or visiting our stunning coastal region.
              </p>
              <Link href="/about" className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white font-medium py-3 px-8 rounded-sm transition-colors shadow-sm">
                Discover Our Story
              </Link>
            </div>
            <div className="w-full md:w-1/2 relative h-[400px] md:h-[500px]">
              <div className="absolute inset-0 rounded-md shadow-lg overflow-hidden">
                <YouTubeVideo 
                  videoId="ODCWz3HwGfY" 
                  title="Vibe Surf School Florida" 
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
            <a 
              href="/booking"
              className="no-underline"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2 h-full">
                <div className="relative h-64">
                  <Image
                    src="/images/surfing/IMG_9109.JPG"
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
                  <div className="bg-blue-50 p-4 rounded-md mb-4">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Experience Details:</span> One-hour sessions including 10-15 minutes of ocean safety and land instruction followed by in-water practice.
                    </p>
                    <p className="text-sm text-gray-700">
                      No age restrictions, but children under 7 require parent participation. Basic swimming ability needed. All equipment provided. Suitable for beginners to intermediate surfers.
                    </p>
                  </div>
                  <p className="text-gray-900 font-semibold mt-4">$100 per person</p>
                </div>
              </div>
            </a>
            
            {/* Card 2 */}
            <a 
              href="/booking"
              className="no-underline"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2 h-full">
                <div className="relative h-64">
                  <Image
                    src="/images/surfing/202428.jpg"
                    alt="Group Surf Lessons"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Group Surf Lessons</h3>
                  <p className="text-gray-700 mb-4">
                    Enjoy surfing with friends or family in our Group Surf Lessons in a fun, collaborative environment. Perfect for friends, family groups or corporate team building.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-md mb-4">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Experience Details:</span> One-hour sessions with 10-15 minutes of safety briefing and instruction followed by guided water practice.
                    </p>
                    <p className="text-sm text-gray-700">
                      Minimum age of 7 years. No weight or height restrictions. All equipment provided. Suitable for all experience levels.
                    </p>
                  </div>
                  <p className="text-gray-900 font-semibold mt-4">$75 per person</p>
                </div>
              </div>
            </a>
            
            {/* Card 3 */}
            <Link 
              href="/contact"
              className="no-underline"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2 h-full">
                <div className="relative h-64">
                  <Image
                    src="/images/surfing/20231.jpg"
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
                  <div className="bg-blue-50 p-4 rounded-md mb-4">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Experience Details:</span> Camps feature a mix of ocean safety education, surfing instruction, and beach activities in a fun group environment.
                    </p>
                    <p className="text-sm text-gray-700">
                      Seasonal availability. All equipment provided. Advanced reservations required. Follow our social media or contact us directly for upcoming dates and details.
                    </p>
                  </div>
                  <p className="text-gray-900 font-semibold mt-4">Seasonal pricing</p>
                </div>
              </div>
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
            <a 
              href="/booking"
              className="no-underline"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2 h-full">
                <div className="relative h-64">
                  <Image
                    src="/images/snorkeling-diving/Guided-Reef-Shore-Dive-Pompano-Beach.webp"
                    alt="Scuba Diving"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Scuba Diving Adventures</h3>
                  <p className="text-gray-700 mb-4">
                    Guided reef shore dive in Pompano Beach or Fort Lauderdale offers a unique opportunity to explore some of Florida's most spectacular underwater environments. <span className="font-semibold">Only available in Pompano Beach and Fort Lauderdale.</span>
                  </p>
                  <div className="bg-blue-50 p-4 rounded-md mb-4">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Experience Details:</span> Tours last approximately 2.5 hours with certified instructors. All participants must be scuba certified (minimum Open Water qualification) and at least 10 years of age.
                    </p>
                    <p className="text-sm text-gray-700">
                      Dive gear is not included, but we can assist with equipment rentals. Groups are limited to 6 participants for a personalized experience.
                    </p>
                  </div>
                  <p className="text-gray-900 font-semibold mt-4">$110 per person</p>
                </div>
              </div>
            </a>
            
            {/* Adventure 2 */}
            <a 
              href="/booking"
              className="no-underline"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2 h-full">
                <div className="relative h-64">
                  <Image
                    src="/images/snorkeling-diving/Pompano-Beach-Guided-Reef-Snorkeling-Tour.webp"
                    alt="Snorkeling Adventures"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Snorkeling Adventures</h3>
                  <p className="text-gray-700 mb-4">
                    Dive into adventure with our Guided Reef snorkeling tours! Embark on an extraordinary underwater journey around vibrant reef systems. <span className="font-semibold">Available at all our locations - Dania Beach, Pompano Beach & Sunny Isles Beach.</span>
                  </p>
                  <div className="bg-blue-50 p-4 rounded-md mb-4">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Experience Details:</span> Tours last approximately 90 minutes. All equipment is included (mask, snorkel, fins, and snorkel vest).
                    </p>
                    <p className="text-sm text-gray-700">
                      Participants must be at least 8 years old. Groups are limited to 6 people to ensure personal attention and safety.
                    </p>
                  </div>
                  <p className="text-gray-900 font-semibold mt-4">$65 per person</p>
                </div>
              </div>
            </a>
            
            {/* Adventure 3 */}
            <a 
              href="/booking"
              className="no-underline"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2 h-full">
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
                    Looking for an exciting experience? Join our Stand Up Paddleboard (SUP) Tours along our stunning coastlines. <span className="font-semibold">Available at all our locations - Dania Beach, Pompano Beach & Sunny Isles Beach.</span>
                  </p>
                  <div className="bg-blue-50 p-4 rounded-md mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Experience Details:</span> Tours last approximately 1 hour. All equipment provided, including paddleboard, paddle, and personal flotation device. Suitable for beginners and experienced paddlers alike.
                    </p>
                  </div>
                  <p className="text-gray-900 font-semibold mt-4">$75 per person</p>
                </div>
              </div>
            </a>
          </div>
          
          {/* Important Information */}
          <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6 mx-auto w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Important Information</h3>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">✓ Safety First:</span> All water activities are supervised by experienced, certified instructors focusing on your safety and enjoyment.
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">✓ Age Requirements:</span> Individual surf lessons have no age restrictions, but children under 7 require parent participation. Group surf lessons have a minimum age of 7 years. Snorkeling tours require participants to be at least 8 years old, while scuba diving adventures require participants to be at least 10 years old with proper certification.
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">✓ Session Duration:</span> Surf lessons are one hour in length, with 10-15 minutes dedicated to ocean safety and land-based instruction, followed by in-water practice. Stand up paddleboarding tours are approximately 1 hour in duration. Snorkeling tours last approximately 90 minutes, and scuba diving adventures are around 2.5 hours.
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">✓ Group Size:</span> To ensure personalized attention and safety, all diving and snorkeling activities are limited to a maximum of 6 people per group.
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">✓ Equipment:</span> All equipment is provided for surf lessons, snorkeling, and paddleboarding. Dive gear is not included for scuba diving adventures, but rental assistance is available.
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">✓ Swimming Requirements:</span> Basic swimming/floating ability is required for all water activities.
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">✓ Reservations:</span> Advanced booking is recommended for all activities as spots fill quickly, especially during peak season. Unfortunately, we have a no cancellation policy. Lessons are subject to weather and swell condition, we will work with you to reschedule your lesson if needed.
            </p>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <FAQ questions={faqQuestions} />
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <TestimonialSection />
        </div>
      </section>
      
      {/* Gallery Link */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Link href="/gallery" className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white px-8 py-4 rounded-sm text-lg font-semibold transition-colors shadow-md">
            Explore Our Gallery
          </Link>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-[#005d8e] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Catch Some Waves?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            Book your surf lesson with Vibe Surf School today and experience the thrill of surfing in Dania Beach, Pompano Beach & Sunny Isles Beach, Florida.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href="/booking"
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