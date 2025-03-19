'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageGallery() {
  const [activeTab, setActiveTab] = useState('exterior');
  const [selectedImage, setSelectedImage] = useState(null);
  
  const exteriorImages = [
    '/images/exterior-views/1.jpg',
    '/images/exterior-views/2.jpg',
    '/images/exterior-views/5.jpg',
    '/images/exterior-views/6.jpg',
    '/images/exterior-views/dji_fly_20240706_141140_39_1720273902484_photo.jpg',
    '/images/exterior-views/20240706_140051.jpg',
  ];
  
  const interiorImages = [
    '/images/interior-views/5-a.jpg',
    '/images/interior-views/7.jpg',
    '/images/interior-views/8.jpg',
    '/images/interior-views/10.jpg',
    '/images/interior-views/14.jpg',
    '/images/interior-views/20.jpg',
  ];
  
  const surroundingImages = [
    '/images/herolds-bay-surroundings/WhatsApp Image 2024-07-07 at 21.22.43.jpeg',
    '/images/herolds-bay-surroundings/WhatsApp Image 2024-07-07 at 21.22.41.jpeg',
    '/images/herolds-bay-surroundings/DSC_2026.JPG',
    '/images/herolds-bay-surroundings/IMG_20190213_061801.jpg',
    '/images/herolds-bay-surroundings/WhatsApp Image 2024-07-07 at 21.22.42.jpeg',
    '/images/herolds-bay-surroundings/10830583_10153071248707188_821919165144872133_o.jpg',
  ];
  
  const activeImages = activeTab === 'exterior' 
    ? exteriorImages 
    : activeTab === 'interior' 
      ? interiorImages 
      : surroundingImages;
  
  const handleImageClick = (src) => {
    setSelectedImage(src);
  };
  
  const closeModal = () => {
    setSelectedImage(null);
  };
  
  return (
    <div id="gallery" className="animate-fadeInUp">
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-5 py-2.5 text-sm font-medium rounded-l-lg transition-all duration-200 ${
              activeTab === 'exterior'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('exterior')}
          >
            Exterior
          </button>
          <button
            type="button"
            className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeTab === 'interior'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('interior')}
          >
            Interior
          </button>
          <button
            type="button"
            className={`px-5 py-2.5 text-sm font-medium rounded-r-lg transition-all duration-200 ${
              activeTab === 'surroundings'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('surroundings')}
          >
            Surroundings
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {activeImages.map((src, index) => (
          <div 
            key={index} 
            className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleImageClick(src)}
          >
            <Image
              src={src}
              alt={`Vibe Guesthouse ${activeTab} image ${index + 1}`}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={85}
              loading={index < 3 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-white bg-opacity-80 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4" onClick={closeModal}>
          <div className="relative max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-opacity"
              onClick={closeModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative h-[80vh] w-full">
              <Image
                src={selectedImage}
                alt="Enlarged view"
                fill
                className="object-contain"
                sizes="100vw"
                quality={90}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}