import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Surf Lesson Locations - Vibe Surf School | Florida & South Africa',
  description: 'Discover our premium surf lesson locations in Dania Beach, Pompano Beach, Sunny Isles Beach, and George, South Africa. Perfect spots for beginners and advanced surfers alike.',
  keywords: 'surf lessons Pompano Beach, Sunny Isles Beach surf spots, Dania Beach surfing, South Africa surf school, George surfing, best places to surf Florida, learn to surf locations, Miami area surf school',
  openGraph: {
    title: 'Surf Lesson Locations - Vibe Surf School',
    description: 'Find the perfect spot to learn surfing with Vibe Surf School in Dania Beach, Pompano Beach, Sunny Isles Beach, and South Africa. Book your surf lesson at one of our beautiful beach locations.',
    url: 'https://vibesurfschool.com/locations',
    siteName: 'Vibe Surf School',
    images: [
      {
        url: 'https://vibesurfschool.com/images/location/pompano-beach.jpg',
        width: 1200,
        height: 630,
        alt: 'Vibe Surf School Location at Pompano Beach',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

const locations = [
  {
    id: 1,
    name: "Pompano Beach",
    address: "1354-1348 S Ocean Blvd, Pompano Beach, FL 33062",
    description: "Our flagship location at Pompano Beach offers perfect beginner-friendly waves with a sandy bottom. The beach features ample parking, restrooms, and shower facilities. Our certified instructors provide lessons for all skill levels with stunning views of the Hillsboro Lighthouse in the background.",
    features: [
      "Sandy bottom beach ideal for beginners",
      "Protected swimming area",
      "On-site board rentals available",
      "Convenient parking and facilities",
      "Shallow waters perfect for learning",
      "Group and private lessons available daily"
    ],
    image: "/images/locations/pompano.jpg",
    mapUrl: "https://maps.app.goo.gl/sVWfpGFN5fT4X86k6"
  },
  {
    id: 2,
    name: "Dania Beach",
    address: "N Beach Rd, Dania Beach, FL 33004",
    description: "Our Dania Beach location provides a more secluded surf experience with consistent waves perfect for intermediate surfers looking to improve their skills. Located next to the historic Dania Beach Pier, this spot offers beautiful views and a more challenging surf environment for those ready to take their skills to the next level.",
    features: [
      "Great for intermediate surfers",
      "Historic pier location",
      "Less crowded than other beaches",
      "Advanced coaching available",
      "Consistent wave breaks",
      "Beautiful natural surroundings"
    ],
    image: "/images/locations/dania.jpg",
    mapUrl: "https://maps.app.goo.gl/eC8a6GDv9qwSe1hK6"
  },
  {
    id: 3,
    name: "Sunny Isles Beach",
    address: "16501 Collins Ave, Sunny Isles Beach, FL 33160",
    description: "Our Sunny Isles Beach location at New Port Pier offers a fantastic surfing experience with stunning ocean views and excellent conditions for surfers of all levels. This vibrant beach area provides the perfect setting for surf lessons with its clear waters and beautiful surroundings.",
    features: [
      "Located at the scenic New Port Pier",
      "Perfect for all skill levels",
      "Beautiful ocean views",
      "Convenient beach access",
      "Ideal wave conditions",
      "Private and group lessons available"
    ],
    image: "/images/locations/sunny-isles.jpg",
    mapUrl: "https://maps.app.goo.gl/NAva9NyD9hkWXYvX8"
  },
  {
    id: 4,
    name: "George, South Africa",
    address: "",
    description: "Our international location in George, South Africa offers a unique surfing experience with beautiful beaches and excellent waves for all skill levels.",
    features: [
      "Beautiful beaches",
      "Excellent waves for all skill levels",
      "Unique surfing experience",
      "International location",
      "Less crowded than other beaches",
      "Advanced coaching available"
    ],
    image: "/images/locations/george.jpg",
    mapUrl: ""
  }
];

export default function LocationsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 py-28 px-4">
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-blue-800 to-teal-900">
          <Image 
            src="/images/surfing/Testimonials.png" 
            alt="Locations Hero Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Our Locations</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Experience the best surfing spots in Dania Beach, Pompano Beach, and Sunny Isles Beach with our premium surf school locations.
          </p>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Where We Teach</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Vibe Surf School operates at three prime locations along the Florida coast and an international location in South Africa, each offering unique experiences for surfers of all levels.
            </p>
          </div>

          {/* Combined Location Map */}
          <div className="mb-16 max-w-4xl mx-auto">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img
                src="/images/location/ourlocations.png"
                alt="Vibe Surf School Locations Map"
                className="w-full h-auto"
              />
            </div>
            <div className="text-center mt-4">
              <p className="text-gray-700">Our three premium surf school locations in South Florida</p>
            </div>
          </div>

          {/* Combined Location Information */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Surf Locations</h3>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                Vibe Surf School offers lessons at three excellent South Florida locations: Pompano Beach, Dania Beach, and Sunny Isles Beach, as well as our international location in George, South Africa. Our Pompano spot is more private, with dedicated parking and beach access, making it perfect for a peaceful, focused surf experience. Dania Beach, located by the historic pier, offers a more public setting with easy access to restrooms, nearby restaurants, and a lively beach atmosphere. Our latest location at New Port Pier in Sunny Isles Beach provides stunning ocean views and excellent conditions for surfers of all levels. All three Florida locations feature sandy bottoms and are ideal for learning, especially during low tides, with consistent waves and conditions suitable for all levels. Our George, South Africa location offers a unique surfing experience with beautiful beaches and excellent waves for all skill levels.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {/* Pompano Beach Map Button */}
                <div className="bg-gray-50 p-6 rounded-lg text-center flex flex-col h-full justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Pompano Beach</h4>
                    <p className="text-gray-600 mb-4">1354-1348 S Ocean Blvd, Pompano Beach, FL 33062</p>
                  </div>
                  <div className="mt-auto">
                    <a 
                      href="https://maps.app.goo.gl/sVWfpGFN5fT4X86k6" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors w-full md:w-auto"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                      </svg>
                      View Pompano on Map
                    </a>
                  </div>
                </div>
                
                {/* Dania Beach Map Button */}
                <div className="bg-gray-50 p-6 rounded-lg text-center flex flex-col h-full justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Dania Beach</h4>
                    <p className="text-gray-600 mb-4">N Beach Rd, Dania Beach, FL 33004</p>
                  </div>
                  <div className="mt-auto">
                    <a 
                      href="https://maps.app.goo.gl/eC8a6GDv9qwSe1hK6" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors w-full md:w-auto"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                      </svg>
                      View Dania on Map
                    </a>
                  </div>
                </div>

                {/* Sunny Isles Beach Map Button */}
                <div className="bg-gray-50 p-6 rounded-lg text-center flex flex-col h-full justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Sunny Isles Beach</h4>
                    <p className="text-gray-600 mb-4">16501 Collins Ave, Sunny Isles Beach, FL 33160</p>
                  </div>
                  <div className="mt-auto">
                    <a 
                      href="https://maps.app.goo.gl/NAva9NyD9hkWXYvX8" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors w-full md:w-auto"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                      </svg>
                      View Sunny Isles on Map
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Book Now Section */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Surf at Our Locations?</h3>
            <a 
              href="/booking"
              className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white font-medium py-4 px-8 rounded-md transition-colors shadow-md text-lg"
            >
              Book Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
