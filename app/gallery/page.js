import ImageGallery from '../components/ImageGallery';
import Image from 'next/image';

export const metadata = {
  title: 'Gallery - Vibe Surf School',
  description: 'View photos of our surf lessons, locations, and surfing experiences in Fort Lauderdale, Florida.',
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 py-28 px-4">
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-blue-600 to-blue-900">
          <Image 
            src="/images/surfing/Testimonials.png" 
            alt="Gallery Hero Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Photo Gallery</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Explore our surf adventures, lessons, and beautiful Fort Lauderdale surfing locations
          </p>
        </div>
      </section>
      
      {/* Gallery Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <ImageGallery />
        </div>
      </section>
    </div>
  );
}