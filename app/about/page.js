import Image from 'next/image';

export const metadata = {
  title: 'About - Vibe Beach House',
  description: 'Learn about our luxury guesthouse in Herolds Bay, Garden Route, South Africa.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full">
        <Image
          src="/images/exterior-views/1.jpg"
          alt="Vibe Beach House Exterior"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
            About Vibe Beach House
          </h1>
        </div>
      </div>
      
      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Our Story</h2>
            <p className="text-gray-700 mb-6 text-lg">
            Nestled in the picturesque coastal village of Herolds Bay, Vibe Beach House is a luxurious self-catering retreat thoughtfully designed to offer the perfect blend of comfort, style, and laid-back coastal living. Owned by passionate Herolds Bay locals—who spent their youth lifesaving and surfing these very shores—this home captures the authentic charm of the Garden Route.
            </p>
            <p className="text-gray-700 mb-10 text-lg">
            Located just a short distance from the beach, 5min drive from Oubaai Golf Course and only 15 minutes from George Airport, Vibe Beach House serves as the ideal base for exploring South Africa’s renowned Garden Route. Whether you’re into hiking, surfing, golfing, or simply seeking a peaceful getaway, Herolds Bay’s secluded coves and natural splendor have something for everyone.
            </p>
            <p className="text-gray-700 mb-10 text-lg">
            Book your stay at Vibe Beach House and immerse yourself in the friendly, relaxed atmosphere of Herolds Bay, a hidden gem where adventure, tranquility, and warm hospitality meet.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
              <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
                <Image 
                  src="/images/exterior-views/2.jpg" 
                  alt="Vibe Beach House Exterior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Luxury Experience</h3>
                <p className="text-gray-700 mb-4">
                  Our guesthouse features 3 spacious bedrooms, a private swimming pool, an office, and a covered braai area, 
                  all designed to provide you with a luxurious and comfortable stay.
                </p>
                <p className="text-gray-700">
                  With modern furnishings, high-speed WiFi, and a fully equipped kitchen, Vibe Beach House offers all the 
                  comforts of home with the luxury of a high-end resort.
                </p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Unique Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Ultimate Braai Living</h3>
                <p className="text-gray-700">
                Make the most of Herolds Bay’s pleasant climate with our spacious covered braai area and private swimming pool.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Modern Comforts</h3>
                <p className="text-gray-700">
                Enjoy a perfect blend of luxury and comfort with our thoughtfully designed living spaces and premium amenities.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Prime Location</h3>
                <p className="text-gray-700">
                  Just minutes from Herolds Bay beach, Oubaai Golf Course, and a short drive to all Garden Route attractions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}