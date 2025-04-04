import Image from 'next/image';
import Link from 'next/link';

/* eslint-disable react/no-unescaped-entities */
export const metadata = {
  title: 'About - Vibe Surf School | Fort Lauderdale Surf Instructors',
  description: 'Learn about Vibe Surf School in Fort Lauderdale, Florida - our experienced instructors, surf philosophy, and mission to share the stoke of surfing with beginners and advanced surfers alike.',
  keywords: 'surf school Fort Lauderdale, surf instructors Florida, learn to surf Florida, surf lessons near me, Vibe Surf School team, Florida surf experience',
  openGraph: {
    title: 'About Vibe Surf School - Fort Lauderdale Surf Instructors',
    description: 'Meet our team of passionate surf instructors dedicated to creating an unforgettable surfing experience in Fort Lauderdale.',
    url: 'https://vibesurfschool.com/about',
    siteName: 'Vibe Surf School',
    images: [
      {
        url: 'https://vibesurfschool.com/images/team/klaus.jpg',
        width: 1200,
        height: 630,
        alt: 'Vibe Surf School Instructors',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
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
              Welcome to Vibe Surf School, where our love for surf culture meets the vibrant charm of South Florida. Since our establishment in 2016 in South Africa, we have been proudly sharing the stoke all around the world, and now in this beautiful city. Our surf lessons and camps are tailored for all levels of experience and are rooted in our unwavering commitment to safety and responsible teaching, a legacy inherited from our founders&apos; lifeguard backgrounds.
            </p>
            <p className="text-gray-700 mb-10 text-lg">
              In the inviting waters and sun-kissed beaches of South Florida, we offer more than just surfing lessons; we strive to create lasting memories and foster connections beyond the surf. Our dedicated instructors go above and beyond to provide a warm and nurturing atmosphere, ensuring that each lesson is a perfect balance of professionalism, care, and enjoyment.
            </p>
            <p className="text-gray-700 mb-10 text-lg">
              Come join us and discover the exhilaration of surfing while making meaningful connections. At Vibe Surf School, we live by our motto: &ldquo;Stoked is our Vibe!&rdquo;
            </p>
            
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
              <div className="relative h-[42rem]">
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
                  Meet Johan Schutte, co-owner and head instructor at Vibe Surf School Fort Lauderdale. With extensive experience surfing world-class breaks from Indonesia to Central America during his global yachting career, Johan brings unmatched wave knowledge to his surf lessons in Florida. His international surfing background ensures students learn techniques adaptable to all ocean conditions.
                </p>
                <p className="text-gray-700 mb-4">
                  Johan's expertise extends beyond surfing instruction to deep understanding of board dynamics. His marine craftsmanship skills with custom surfboards and yacht construction give him unique insights into equipment selection and performance. This knowledge helps Fort Lauderdale surf students progress faster by matching them with the perfect boards for their skill level and learning style.
                </p>
                <p className="text-gray-700">
                  Safety remains central to Johan's teaching philosophy at Vibe Surf School. Drawing from his professional lifeguarding experience, he combines comprehensive ocean safety protocols with his intuitive understanding of wave dynamics. Whether you're booking beginner surf lessons or advanced coaching, Johan's approach ensures a secure, confidence-building experience in South Florida's waters.
                </p>
              </div>

              <div className="relative h-[42rem] md:order-2">
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
                  Klaus Schroder founded Vibe Surf School in South Africa in 2016 before bringing his surf instruction expertise to Fort Lauderdale. His coastal engineering background combined with a lifelong passion for surfing uniquely positions him to teach surf lessons that blend technical knowledge with fun. Together with Johan, his mission is creating Florida's most comprehensive surf school experience for beginners and advanced surfers alike.
                </p>
                <p className="text-gray-700 mb-4">
                  As a tech consultant by profession, Klaus applies analytical thinking to revolutionize surf instruction in Fort Lauderdale. His data-driven approach allows Vibe Surf School to offer personalized lessons tailored to each student's learning style and progression goals. This innovative methodology, uncommon in traditional surf schools, significantly accelerates skill development while maintaining a supportive, enjoyable learning environment.
                </p>
                <p className="text-gray-700">
                  Safety is fundamental at Vibe Surf School thanks to Klaus's impressive 12 years of lifeguarding experience. His extensive ocean safety knowledge ensures all surf lessons in Fort Lauderdale are conducted with proper risk assessment and emergency preparedness. Whether you're taking your first surf lesson or refining advanced techniques, Klaus's instruction combines technical precision with a genuine love for sharing the transformative experience of riding waves in South Florida.
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