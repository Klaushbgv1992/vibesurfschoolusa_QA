import Image from 'next/image';

export const metadata = {
  title: 'About - Vibe Guesthouse',
  description: 'Learn about our luxury guesthouse in Herolds Bay, Garden Route, South Africa.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full">
        <Image
          src="/images/exterior-views/1.jpg"
          alt="Vibe Guesthouse Exterior"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
            About Vibe Guesthouse
          </h1>
        </div>
      </div>
      
      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Story</h2>
            <p className="text-gray-700 mb-6 text-lg">
              Nestled in the picturesque coastal village of Herolds Bay, Vibe Guesthouse offers a luxurious retreat 
              with breathtaking ocean views and modern amenities. Our guesthouse was designed to provide guests with the perfect 
              balance of comfort, style, and natural beauty.
            </p>
            <p className="text-gray-700 mb-10 text-lg">
              Located just a short walk from the pristine beaches of Herolds Bay and a 15-minute drive from George Airport, 
              Vibe Guesthouse provides the ideal base for exploring the wonders of South Africa's renowned Garden Route.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
              <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
                <Image 
                  src="/images/exterior-views/2.jpg" 
                  alt="Vibe Guesthouse Exterior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Luxury Experience</h3>
                <p className="text-gray-700 mb-4">
                  Our guesthouse features 3 spacious bedrooms, a private swimming pool, and a covered braai area, 
                  all designed to provide you with a luxurious and comfortable stay.
                </p>
                <p className="text-gray-700">
                  With modern furnishings, high-speed WiFi, and a fully equipped kitchen, Vibe Guesthouse offers all the 
                  comforts of home with the luxury of a high-end resort.
                </p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Unique Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Ocean Views</h3>
                <p className="text-gray-700">
                  Enjoy breathtaking views of the Indian Ocean from multiple vantage points in the guesthouse.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Private Pool</h3>
                <p className="text-gray-700">
                  Relax and unwind in our private swimming pool with stunning views of the surrounding landscape.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Prime Location</h3>
                <p className="text-gray-700">
                  Just minutes from Herolds Bay beach and a short drive to all Garden Route attractions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}