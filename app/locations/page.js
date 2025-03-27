import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const locations = [
  {
    id: 1,
    name: "Pompano Beach",
    address: "50 N Ocean Blvd, Pompano Beach, FL 33062",
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
    mapUrl: "https://maps.app.goo.gl/h1RjNjf8iM1wqTaR6"
  },
  {
    id: 2,
    name: "Dania Beach",
    address: "300 N Beach Rd, Dania Beach, FL 33004",
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
    mapUrl: "https://maps.app.goo.gl/Zvn7BjpLHCDmD2Lu5"
  }
];

export default function LocationsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 py-28 px-4">
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-blue-800 to-teal-900">
          <Image 
            src="/images/surfing/1f80a01b-02ee-4983-b9ba-b0cbf048fd8d.JPG" 
            alt="Locations Hero Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Our Locations</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Experience the best surfing spots in Fort Lauderdale with our premium surf school locations.
          </p>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Where We Teach</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Vibe Surf School operates at two prime locations along the Florida coast, each offering unique experiences for surfers of all levels.
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
              <p className="text-gray-700">Our two premium surf school locations in South Florida</p>
            </div>
          </div>

          {/* Location Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Pompano Beach Location */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pompano Beach</h3>
                <p className="text-gray-600 mb-4">50 N Ocean Blvd, Pompano Beach, FL 33062</p>
                <p className="text-gray-700 mb-6">{locations[0].description}</p>
                
                <h4 className="font-semibold text-gray-900 mb-3">Location Features:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  {locations[0].features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap gap-3">
                  <a 
                    href={locations[0].mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                    </svg>
                    View on Map
                  </a>
                  <a 
                    href="https://vibesurfschool.setmore.com/pompanobeach" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Book This Location
                  </a>
                </div>
              </div>
            </div>

            {/* Dania Beach Location */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Dania Beach</h3>
                <p className="text-gray-600 mb-4">300 N Beach Rd, Dania Beach, FL 33004</p>
                <p className="text-gray-700 mb-6">{locations[1].description}</p>
                
                <h4 className="font-semibold text-gray-900 mb-3">Location Features:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  {locations[1].features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap gap-3">
                  <a 
                    href={locations[1].mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                    </svg>
                    View on Map
                  </a>
                  <a 
                    href="https://vibesurfschool.setmore.com/fortlauderdale" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Book This Location
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Additional Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What to Expect</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-blue-50 rounded-md p-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Duration</h3>
                <p className="text-gray-700">
                  Our standard lessons are 90 minutes long, with the first 30 minutes dedicated to safety, technique, and land practice.
                </p>
              </div>
              <div className="bg-blue-50 rounded-md p-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Equipment</h3>
                <p className="text-gray-700">
                  All necessary equipment is provided, including surfboards, rashguards, and wetsuits if needed for cooler weather.
                </p>
              </div>
              <div className="bg-blue-50 rounded-md p-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">What to Bring</h3>
                <p className="text-gray-700">
                  Bring swimwear, sunscreen, a towel, and water. We recommend wearing board shorts or athletic clothing for comfort.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Catch Some Waves?</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Join us at one of our premier locations for an unforgettable surfing experience. 
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://vibesurfschool.setmore.com/fortlauderdale" 
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-md font-semibold transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Lesson
            </a>
            <Link 
              href="/contact" 
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-md font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
