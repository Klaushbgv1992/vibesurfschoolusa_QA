import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const merchandiseItems = [
  {
    id: 1,
    name: "Vibe Surf School T-Shirt",
    image: "/images/merch/tshirt.png",
    price: "$24.99",
    description: "Comfortable cotton t-shirt with the Vibe Surf School logo",
    link: "https://vibe-surf-school.printify.me/product/4385494/vibe-surf-school-short-sleeve-tee"
  },
  {
    id: 2,
    name: "Vibe Surf Hoodie (Black)",
    image: "/images/merch/blackhood.png",
    price: "$49.99",
    description: "Stay warm after a surf session with our premium hoodie",
    link: "https://vibe-surf-school.printify.me/product/4385504/vibe-surf-school-mineral-wash-hoodie"
  },
  {
    id: 3,
    name: "Vibe Surf Trucker Cap",
    image: "/images/merch/truckercap.png",
    price: "$19.99",
    description: "Protect yourself from the sun with our stylish surf cap",
    link: "https://vibe-surf-school.printify.me/product/4385975/vibe-surf-school-trucker-caps"
  },
  {
    id: 4,
    name: "Vibe Surf Bucket Hat",
    image: "/images/merch/buckethat.png",
    price: "$24.99",
    description: "Stay stylish and shaded with our surf bucket hat",
    link: "https://vibe-surf-school.printify.me/product/4402521/vibe-surf-bucket-hat"
  },
  {
    id: 5,
    name: "Vibe Surf Towel",
    image: "/images/merch/towel.png",
    price: "$29.99",
    description: "Microfiber surf towel with Vibe Surf School logo",
    link: "https://vibe-surf-school.printify.me/product/4402005/vibe-surf-palm-trees-and-beach-towel"
  },
  {
    id: 6,
    name: "Vibe Tote Bag",
    image: "/images/merch/totebag.png",
    price: "$22.99",
    description: "Carry your surf essentials in our stylish tote bag",
    link: "https://vibe-surf-school.printify.me/product/4386094/vibe-surf-school-weekender-tote-bag"
  },
  {
    id: 7,
    name: "Vibe Surf Hoodie (White)",
    image: "/images/merch/whitehood.png",
    price: "$44.99",
    description: "Lightweight crewneck sweatshirt with our surf logo",
    link: "https://vibe-surf-school.printify.me/product/4385501/vibe-surf-school-crewneck-sweatshirt"
  },
  {
    id: 8,
    name: "Vibe Water Bottle",
    image: "/images/merch/bottle.png",
    price: "$14.99",
    description: "Stay hydrated with our eco-friendly reusable water bottle",
    link: "https://vibe-surf-school.printify.me/product/4402120/vibe-surf-stainless-steel-water-bottle"
  }
];

export default function MerchandisePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 py-28 px-4">
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-teal-600 to-blue-900">
          <Image 
            src="/images/surfing/Testimonials.png" 
            alt="Merchandise Hero Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Vibe Surf Merchandise</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Rep the Vibe with our exclusive surf school apparel and accessories.
          </p>
        </div>
      </section>

      {/* Merchandise Items Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Collection</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Browse our collection of high-quality surf apparel and accessories. All merchandise features our iconic Vibe Surf School branding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {merchandiseItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-transform hover:scale-[1.02]">
                <a 
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative h-64 w-full block p-4 flex items-center justify-center"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                </a>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                  </div>
                  <p className="text-gray-700 mb-4">{item.description}</p>
                  <a 
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-md font-medium transition-colors"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Orders Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-1/2 relative h-[400px]">
              <Image
                src="/images/merch/Group Custom Orders.png"
                alt="Group & Custom Orders"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Group & Custom Orders</h2>
              <p className="text-lg text-gray-700 mb-6">
                Planning a surf camp or corporate event? We offer custom merchandise options for groups with your team logo alongside our Vibe branding.
              </p>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits of Group Orders:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Bulk discounts available for orders of 10+ items</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Custom color options for your team or event</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Add your company or event logo alongside our branding</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Quick turnaround times for time-sensitive events</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link 
                    href="/contact" 
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                  >
                    Request Custom Order
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Visit Our Online Store</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Browse our complete collection of Vibe Surf School merchandise on our Printify store.
          </p>
          <div className="flex justify-center">
            <a 
              href="https://vibe-surf-school.printify.me/products" 
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shop Online
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
