import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const webcams = [
  {
    name: "Wyndham Deerfield Beach Resort",
    url: "https://www.wyndhamdeerfieldresort.com/live-webcam"
  },
  {
    name: "Hillsboro Lighthouse",
    url: "https://www.earthcam.com/usa/florida/hillsboro/?cam=hillsboro"
  },
  {
    name: "Pompano Beach Pier",
    url: "https://www.pompanobeachfl.gov/webcams#pier"
  },
  {
    name: "Ebb Tide Resort",
    url: "https://ebbtideresort.com/ebb-tide-resort-live-beach-cam/"
  },
  {
    name: "Beachcomber Resort & Club",
    url: "https://www.pompanobeachcam.com"
  },
  {
    name: "Lauderdale-by-the-Sea Beach",
    url: "https://www.discoverlbts.com/live-beach-webcam/"
  },
  {
    name: "Windjammer Resort & Beach Club",
    url: "https://windjammerresort.com/webcam"
  },
  {
    name: "Hilton Fort Lauderdale Beach Resort",
    url: "https://www.fllbeachcam.com"
  },
  {
    name: "Fort Lauderdale Beach",
    url: "https://www.ftlauderdalebeachcam.com"
  },
  {
    name: "Dania Beach Pier and Beach",
    url: "https://www.youtube.com/watch?v=o1eTLR7Degs"
  },
  {
    name: "Hollywood Beach",
    url: "https://www.local10.com/weather/2019/07/19/hollywood-beach-camera/"
  }
];

export default function SurfCamsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 py-28 px-4">
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-blue-900 to-gray-900">
          <Image 
            src="/images/surfing/IMG_6146.JPG" 
            alt="Surf Cams Hero Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Surf Cams</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Check the current surf conditions along Fort Lauderdale and the surrounding beaches with our curated list of live webcams.
          </p>
        </div>
      </section>

      {/* Webcams Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
            {/* Webcam Image */}
            <div className="w-full md:w-1/2 relative">
              <Image
                src="/images/webcams/webcam-locations.png"
                alt="Surf Cam Locations"
                width={800}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </div>

            {/* Webcam List */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Live Surf Cameras</h2>
              <p className="text-lg text-gray-700 mb-8">
                Monitor the waves and conditions before your surf session with these live webcams positioned at key spots along Fort Lauderdale, Pompano Beach, and Dania Beach.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {webcams.map((webcam, index) => (
                  <a 
                    key={index}
                    href={webcam.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    <div className="w-8 h-8 mr-3 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    <span className="text-gray-800 font-medium">{webcam.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience the Waves?</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Book a surf lesson with us and learn from experienced instructors in Fort Lauderdale.
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
