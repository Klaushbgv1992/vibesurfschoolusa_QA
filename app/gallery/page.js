import Image from 'next/image';

export const metadata = {
  title: 'Gallery - Vibe Guesthouse',
  description: 'Explore photos of our luxury guesthouse in Herolds Bay, Garden Route, South Africa.',
};

export default function GalleryPage() {
  // Define gallery categories and images
  const galleryCategories = [
    {
      name: 'Exterior Views',
      images: [
        '/images/exterior-views/dji_fly_20240706_141140_39_1720273902484_photo.jpg',
        '/images/exterior-views/1.jpg',
        '/images/exterior-views/2.jpg',
        '/images/exterior-views/5.jpg',
        '/images/exterior-views/6.jpg',
      ]
    },
    {
      name: 'Interior Spaces',
      images: [
        '/images/interior-views/10.jpg',
        '/images/interior-views/5-a.jpg',
        '/images/interior-views/7.jpg',
        '/images/interior-views/14.jpg',
      ]
    },
    {
      name: 'Herolds Bay',
      images: [
        '/images/herolds-bay-surroundings/DSC_2026.JPG',
        '/images/herolds-bay-surroundings/WhatsApp Image 2024-07-07 at 21.22.43.jpeg',
      ]
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full">
        <Image
          src="/images/exterior-views/2.jpg"
          alt="Vibe Guesthouse Gallery"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
            Gallery
          </h1>
        </div>
      </div>
      
      {/* Gallery Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {galleryCategories.map((category, index) => (
            <div key={index} className="mb-16 last:mb-0">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">{category.name}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {category.images.map((image, imageIndex) => (
                  <div key={imageIndex} className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={image}
                      alt={`${category.name} - Image ${imageIndex + 1}`}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={85}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}