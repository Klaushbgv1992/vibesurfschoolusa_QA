import ImageGallery from '../components/ImageGallery';

export const metadata = {
  title: 'Gallery - Vibe Beach House',
  description: 'Explore photos of our luxury guesthouse in Herolds Bay, Garden Route, South Africa.',
};

export default function GalleryPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Gallery Content */}
      <section className="pt-24 pb-12 bg-white w-full">
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-900">Photo Gallery</h1>
        <div className="w-full">
          <ImageGallery />
        </div>
      </section>
    </div>
  );
}