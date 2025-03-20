import { HomeIcon, WifiIcon, HeartIcon, TvIcon, BeakerIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function PropertyInfo() {
  const amenities = [
    { name: 'Entire Home', icon: <HomeIcon className="w-6 h-6" />, description: '3 bedrooms, 2.5 baths, sleeps 8' },
    { name: 'Private Pool', icon: <SparklesIcon className="w-6 h-6" />, description: 'With stunning ocean views' },
    { name: 'High-Speed WiFi', icon: <WifiIcon className="w-6 h-6" />, description: '50Mbps dedicated connection' },
    { name: 'Braai Area', icon: <BeakerIcon className="w-6 h-6" />, description: 'Covered outdoor grill' },
    { name: 'Smart TVs', icon: <TvIcon className="w-6 h-6" />, description: 'Netflix & streaming services' },
    { name: 'Coastal Attractions', icon: <HeartIcon className="w-6 h-6" />, description: 'Spectacular beaches nearby' }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Luxury Amenities</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need for a perfect stay at our premium guesthouse
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="text-[#005d8e] mr-4">
                  {amenity.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{amenity.name}</h3>
              </div>
              <p className="text-gray-600">{amenity.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className="bg-white py-6 px-8 rounded-lg shadow-md border border-gray-100 max-w-md text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Rates from</h3>
            <p className="text-4xl font-bold text-[#005d8e] mb-1">R2,500</p>
            <p className="text-gray-600 mb-4">per night</p>
            <a 
              href="https://www.airbnb.com/rooms/1185679450503007200?source_impression_id=p3_1742350524_P3ntnWSMNQoPAbvn" 
              className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white px-6 py-3 rounded-sm font-semibold transition-colors shadow-md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book on Airbnb
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Additional Information</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-[#005d8e] mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Self check-in with lockbox</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-[#005d8e] mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Ultimate Braai Living</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-[#005d8e] mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Private garage parking for two vehicles</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-[#005d8e] mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>5-minute walk to Herolds Bay beach</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-[#005d8e] mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Modern, fully-equipped kitchen with premium appliances</span>
              </li>
            </ul>
          </div>
          <div className="bg-[#005d8e] text-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">Book Your Dream Vacation</h3>
            <p className="mb-6">
              Experience luxury living at Vibe Beach House. Our calendar fills up quickly, especially during peak seasons. Contact us today to secure your preferred dates.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.airbnb.com/rooms/1185679450503007200?source_impression_id=p3_1742350524_P3ntnWSMNQoPAbvn"
                className="bg-white text-[#005d8e] px-4 py-2 rounded-sm font-medium transition-colors hover:bg-gray-50"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Now
              </a>
              <a
                href="/contact"
                className="bg-transparent text-white border border-white px-4 py-2 rounded-sm font-medium transition-colors hover:bg-[#00486e]"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}