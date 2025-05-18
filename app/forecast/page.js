import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/* eslint-disable react/no-unescaped-entities */
const forecastResources = [
  {
    name: "Windguru",
    url: "https://www.windguru.cz/181951",
    description: "Detailed wind and wave forecasts with comprehensive meteorological data."
  },
  {
    name: "Surf-Forecast",
    url: "https://www.surf-forecast.com/breaks/Fort-Lauderdale-14th-Street/forecasts/latest/six_day",
    description: "Six-day surf forecasts with wave height, period, and direction information."
  },
  {
    name: "Surfline",
    url: "https://www.surfline.com/surf-report/ne-14th-ct-/584204214e65fad6a7709d1e",
    description: "Premium surf reports and forecasts with detailed conditions and webcams."
  }
];

export default function ForecastPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 py-28 px-4">
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-blue-600 to-blue-900">
          <Image 
            src="/images/surfing/Testimonials.png" 
            alt="Surf Forecast Hero Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Surf Forecast</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Check the latest surf forecasts for Fort Lauderdale and surrounding beaches to plan your perfect surf session.
          </p>
        </div>
      </section>

      {/* Forecast Resources Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Surf Forecast Resources</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              We&apos;ve curated the best surf forecast resources to help you plan your next surf session. 
              Check these trusted sites for accurate forecasts and real-time conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {forecastResources.map((resource, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{resource.name}</h3>
                  <p className="text-gray-700 mb-6">{resource.description}</p>
                  <a 
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white px-6 py-3 rounded-md font-medium transition-colors"
                  >
                    View {resource.name} Forecast
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Read a Surf Forecast</h2>
          <div className="flex flex-col md:flex-row gap-10">
            <div className="w-full md:w-3/5">
              <div className="space-y-4">
                <div className="bg-white rounded-md shadow-sm p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Wave Height</h3>
                  <p className="text-gray-700">The measurement of waves from trough to crest. Beginners should look for waves 1-3 feet high.</p>
                </div>
                <div className="bg-white rounded-md shadow-sm p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Wave Period</h3>
                  <p className="text-gray-700">The time between waves measured in seconds. Longer periods (10+ seconds) typically mean cleaner, more organized waves.</p>
                </div>
                <div className="bg-white rounded-md shadow-sm p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Wind Direction</h3>
                  <p className="text-gray-700">Offshore winds (blowing from land to sea) create cleaner waves, while onshore winds create choppy conditions.</p>
                </div>
                <div className="bg-white rounded-md shadow-sm p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Tide</h3>
                  <p className="text-gray-700">Different breaks work better at different tide levels. Ask our instructors about the best tide for your local spot.</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/5">
              <div className="bg-white rounded-lg shadow-lg p-3 h-full">
                <img
                  src="/images/surfforecast/surfforecast.png"
                  alt="Surf Conditions"
                  className="w-full h-auto rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Now Section */}
      <section className="py-10 bg-white text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Catch Some Waves?</h3>
          <a 
            href="/booking"
            className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white font-medium py-4 px-8 rounded-md transition-colors shadow-md text-lg"
          >
            Book Now
          </a>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#005d8e] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Ride the Perfect Wave?</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Join us for surf lessons tailored to all skill levels and learn how to read the conditions like a pro.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/booking" 
              className="bg-white hover:bg-gray-100 text-[#005d8e] px-8 py-3 rounded-md font-semibold transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Lesson
            </a>
            <Link 
              href="/contact" 
              className="bg-[#00486e] hover:bg-[#003a59] text-white px-8 py-3 rounded-md font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
