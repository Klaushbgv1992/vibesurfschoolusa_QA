import ImageGallery from '../components/ImageGallery';

export const metadata = {
  title: 'Gallery - Vibe Surf School',
  description: 'View photos of our surf lessons, locations, and surfing experiences in Fort Lauderdale, Florida.',
};

export default function GalleryPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative bg-gray-900 py-28 px-4">
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-blue-600 to-blue-900">
          <img 
            src="/images/surfing/953a6d74-2efe-44c3-b778-78c183ec5bd1.JPG" 
            alt="Gallery Hero Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Photo Gallery</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Explore our surf adventures, lessons, and beautiful Fort Lauderdale surfing locations
          </p>
        </div>
      </section>
      
      {/* Gallery Content */}
      <section className="py-12 bg-white w-full">
        <div className="w-full">
          <ImageGallery />
        </div>
      </section>
    </div>
  );
}