import { BeakerIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function PropertyInfo() {
  const services = [
    { 
      name: 'Individual Surf Lessons', 
      icon: <SparklesIcon className="w-6 h-6" />, 
      description: '$100 per person, customized instruction' 
    },
    { 
      name: 'Group Surf Lessons', 
      icon: <SparklesIcon className="w-6 h-6" />, 
      description: '$75 per person, fun group environment' 
    },
    { 
      name: 'Kids Surf Camp', 
      icon: <SparklesIcon className="w-6 h-6" />, 
      description: 'Safe and exciting environment for kids' 
    },
    { 
      name: 'Scuba Diving Adventures', 
      icon: <BeakerIcon className="w-6 h-6" />, 
      description: '$110 per person, guided reef dives' 
    },
    { 
      name: 'Snorkeling Adventures', 
      icon: <BeakerIcon className="w-6 h-6" />, 
      description: '$65 per person, explore vibrant reefs' 
    },
    { 
      name: 'Paddleboarding Tours', 
      icon: <BeakerIcon className="w-6 h-6" />, 
      description: '$75 per person, coastal and mangrove tours' 
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need for an unforgettable ocean adventure in Fort Lauderdale
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="text-[#005d8e] mr-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
              </div>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className="bg-white py-6 px-8 rounded-lg shadow-md border border-gray-100 max-w-md text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Lessons starting at</h3>
            <p className="text-4xl font-bold text-[#005d8e] mb-1">$75</p>
            <p className="text-gray-600 mb-4">per person</p>
            <a 
              href="/booking" 
              className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white px-6 py-3 rounded-sm font-semibold transition-colors shadow-md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Lesson
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
                <span>All necessary equipment provided</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-[#005d8e] mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Certified, experienced instructors</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-[#005d8e] mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Convenient locations in Pompano and Dania Beach</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-[#005d8e] mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Lessons available 7 days a week</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-[#005d8e] mt-1 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Perfect for all skill levels, from beginners to advanced</span>
              </li>
            </ul>
          </div>
          <div className="bg-[#005d8e] text-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">Book Your Surf Adventure</h3>
            <p className="mb-6">
              Experience the thrill of surfing with Vibe Surf School. Our lesson spots fill up quickly, especially during weekends and holidays. Book today to secure your preferred time and location.
            </p>
            <div className="flex space-x-4">
              <a
                href="/booking"
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