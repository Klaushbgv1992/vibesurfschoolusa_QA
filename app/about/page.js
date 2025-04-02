import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About - Vibe Surf School',
  description: 'Learn about Vibe Surf School in Fort Lauderdale, Florida - our story, instructors, and mission to share the stoke of surfing.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 py-28 px-4">
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-blue-600 to-blue-900">
          <Image
            src="/images/surfing/Testimonials.png"
            alt="About Vibe Surf School"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            About Vibe Surf School
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            We are all about sharing the good vibes and the stoke of surfing.
          </p>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Story</h2>
            <p className="text-gray-700 mb-6 text-lg">
              Welcome to Vibe Surf School, where our love for surf culture meets the vibrant charm of South Florida. Since our establishment in 2016 in South Africa, we have been proudly sharing the stoke all around the world, and now in this beautiful city. Our surf lessons and camps are tailored for all levels of experience and are rooted in our unwavering commitment to safety and responsible teaching, a legacy inherited from our founders' lifeguard backgrounds.
            </p>
            <p className="text-gray-700 mb-10 text-lg">
              In the inviting waters and sun-kissed beaches of South Florida, we offer more than just surfing lessons; we strive to create lasting memories and foster connections beyond the surf. Our dedicated instructors go above and beyond to provide a warm and nurturing atmosphere, ensuring that each lesson is a perfect balance of professionalism, care, and enjoyment.
            </p>
            <p className="text-gray-700 mb-10 text-lg">
              Come join us and discover the exhilaration of surfing while making meaningful connections. At Vibe Surf School, we live by our motto: "Stoked is our Vibe!"
            </p>
            
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
              <div className="relative h-96">
                <Image 
                  src="/images/team/johan.jpg" 
                  alt="Johan Schutte - Vibe Surf School Co-Owner"
                  fill
                  className="object-cover object-top rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Johan Schutte</h3>
                <h4 className="text-lg font-semibold text-blue-600 mb-4">Co-Owner & Head Instructor</h4>
                <p className="text-gray-700 mb-4">
                  Get ready to catch some seriously epic waves with Johan Schutte, co-owner of Vibe Surf School Florida. With his background in geosciences and mining, he's bringing a wealth of knowledge to the sunny shores of Florida.
                </p>
                <p className="text-gray-700 mb-4">
                  But that's not all – Johan's got a sharp skill set in teak decking and carpentry gained through his years in the marine yachting industry. It's no wonder Vibe has become synonymous with excellence. And with three years as a lifeguard under his belt, Johan not only prioritizes the safety of his students, but also infuses every lesson with his passion for the sea.
                </p>
                <p className="text-gray-700">
                  Hang ten with Johan and experience the vibe at Vibe Surf School!
                </p>
              </div>

              <div className="relative h-96 md:order-2">
                <Image 
                  src="/images/team/klaus.jpg" 
                  alt="Klaus Schroder - Vibe Surf School Co-Owner"
                  fill
                  className="object-cover rounded-lg"
                  style={{ objectPosition: "center top" }}                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="md:order-1">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Klaus Schroder</h3>
                <h4 className="text-lg font-semibold text-blue-600 mb-4">Co-Owner & Instructor</h4>
                <p className="text-gray-700 mb-4">
                  Meet Klaus Schroder, the co-founder of Vibe Surf School Florida. From his extensive experience in data, technology, and coastal and environmental engineering, it's clear that Klaus is not your average entrepreneur.
                </p>
                <p className="text-gray-700 mb-4">
                  He is dedicated to promoting sustainable practices and incorporating them into business. Klaus' venture into owning a surf school stems from his love for both safety and surfing. He constantly strives to improve and enhance the surf instruction experience by infusing his 12 years of lifeguarding expertise.
                </p>
                <p className="text-gray-700">
                  With Vibe Surf School, Klaus is transforming the traditional methods of surf instruction through his innovative and analytical approach.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-8 text-gray-800">What We Offer</h2>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm mb-10">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Surf With Us</h3>
              <p className="text-gray-700 mb-6">
                Vibe Surf School is a place where you become part of the thrilling spirit of the ocean. We are one of the leading surf schools in South Florida, and we are committed to ensuring that your journey in surfing is memorable.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-xl font-bold mb-2 text-blue-600">Individual Surf Lessons</h4>
                  <p className="text-gray-700 mb-3 font-semibold">$100 per person</p>
                  <p className="text-gray-700">
                    Experience personalized surfing with our Individual Surf Lessons, tailored to your skill level and goals with certified instructors to fast-track your progress. Enjoy a customized experience with all equipment provided.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-xl font-bold mb-2 text-blue-600">Group Surf Lessons</h4>
                  <p className="text-gray-700 mb-3 font-semibold">$75 per person</p>
                  <p className="text-gray-700">
                    Enjoy surfing with friends or family in our Group Surf Lessons in a fun, collaborative environment. All necessary equipment is provided, making it an ideal bonding experience.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-xl font-bold mb-2 text-blue-600">Surf Camps</h4>
                  <p className="text-gray-700">
                    Our Kids Surf Camp offers a safe and exciting environment to learn ocean safety, surfing etiquette, and basic skills. This program fosters a love for surfing, respect for the sea, combining beach games with surf lessons.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Adventure With Us</h3>
              <p className="text-gray-700 mb-6">
                Beyond surfing, Vibe Surf School offers exhilarating adventures in the ocean. Take advantage of our guided stand-up paddleboarding tours or dive into our snorkeling or scuba diving adventures to discover colorful reefs. We have the ideal excursion for you, whether you want to paddle across picturesque lakes or explore underwater wonders!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-xl font-bold mb-2 text-blue-600">Scuba Diving Adventures</h4>
                  <p className="text-gray-700 mb-3 font-semibold">$110 per person</p>
                  <p className="text-gray-700">
                    Guided reef shore dive in Pompano Beach or Fort Lauderdale offers a unique opportunity to explore some of Florida's most spectacular underwater environments with the guidance of experienced dive professionals.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-xl font-bold mb-2 text-blue-600">Snorkeling Adventures</h4>
                  <p className="text-gray-700 mb-3 font-semibold">$65 per person</p>
                  <p className="text-gray-700">
                    Dive into adventure with our Guided Reef snorkeling tour in Pompano Beach! Embark on an extraordinary underwater journey around the vibrant reef system, with exclusive access from a private beach in Pompano Beach, FL.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-xl font-bold mb-2 text-blue-600">Paddleboarding Adventures</h4>
                  <p className="text-gray-700 mb-3 font-semibold">$75 per person</p>
                  <p className="text-gray-700">
                    Looking for an exciting and memorable experience? Look no further than our Stand Up Paddleboard (SUP) Tours. We do scenic tours along the stunning coastline of Pompano Beach, Fort Lauderdale, and Dania Beach's Mangroves.
                  </p>
                </div>
              </div>
            </div>

            {/* Book Now Section */}
            <div className="text-center mt-10">
              <a 
                href="https://vibesurfschool.setmore.com/fortlauderdale" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white font-medium py-4 px-8 rounded-md transition-colors shadow-md text-lg"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Catch Some Waves?</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Book a surf lesson with us today and experience the thrill of surfing in beautiful Fort Lauderdale.
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="https://vibesurfschool.setmore.com/fortlauderdale" 
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Lesson
            </a>
            <Link 
              href="/contact" 
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}