'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageGallery() {
  const [activeTab, setActiveTab] = useState('surfing');
  const [selectedImage, setSelectedImage] = useState(null);
  
  const surfingImages = [
    '/images/surfing/IMG_9138.JPG',
    '/images/surfing/DSC_0216_Original.jpg',
    '/images/surfing/IMG_1308.JPG',
    '/images/surfing/IMG_9109.JPG',
    '/images/surfing/IMG_6216.jpg',
    '/images/surfing/IMG_0047.jpg',
    '/images/surfing/IMG_6552.JPG',
    '/images/surfing/DSC_0232_Original.jpg',
    '/images/surfing/b6aef2d1-caf3-4546-8cb4-518b703e27da.JPG',
    '/images/surfing/e15d6653-2ebf-48dc-87b7-dbb45ee97cca.JPG',
    '/images/surfing/953a6d74-2efe-44c3-b778-78c183ec5bd1.JPG',
    '/images/surfing/1f80a01b-02ee-4983-b9ba-b0cbf048fd8d.JPG',
    '/images/surfing/020f6aa7-d6c1-4d12-afd3-c774799d765e.JPG',
    '/images/surfing/a2213b18-6110-4469-8e0a-7bad605dd029.JPG',
    '/images/surfing/b0019b65-7035-4d92-a1ee-4c38951d4e95.JPG',
    '/images/surfing/ead52ce5-432c-4dc1-8d68-78e00955dbb3.JPG',
    '/images/surfing/ff9c703f-2f0a-496f-b793-c537122d4bbf.JPG',
    '/images/surfing/1993e511-17a7-481a-b9b1-08a1a9d29b10.JPG',
    '/images/surfing/20231.jpg',
    '/images/surfing/20241.png',
    '/images/surfing/202418.JPG',
    '/images/surfing/202419.JPG',
    '/images/surfing/20242.png',
    '/images/surfing/202420.JPG',
    '/images/surfing/202421.jpg',
    '/images/surfing/202422.jpg',
    '/images/surfing/202423.jpg',
    '/images/surfing/202424.jpg',
    '/images/surfing/202425.jpg',
    '/images/surfing/202426.JPG',
    '/images/surfing/202427.JPG',
    '/images/surfing/202428.jpg',
    '/images/surfing/202429.jpg',
    '/images/surfing/20243.jpg',
    '/images/surfing/202430.jpg',
    '/images/surfing/202431.jpg',
    '/images/surfing/202432.jpg',
    '/images/surfing/20244.jpg',
    '/images/surfing/GPTempDownload.jpg',
  ];
  
  const snorkelingDivingImages = [
    '/images/snorkeling-diving/Guided-Reef-Shore-Dive-Pompano-Beach.webp',
    '/images/snorkeling-diving/Guided-Reef-Snorkeling-Tour-Fort-Lauderdale.webp',
    '/images/snorkeling-diving/Pompano-Beach-Guided-Reef-Snorkeling-Tour.webp',
    '/images/snorkeling-diving/Turtle-on-Guided-Reef-Dive-Pompano-Beach.webp',
    '/images/snorkeling-diving/Nurse-Shark-on-Anglins-Pier-Reef-Fort-Lauderdale.webp',
    '/images/snorkeling-diving/Anglins-Pier-Reef-Guided-Dive-Fort-Lauderdale-.webp',
    '/images/snorkeling-diving/Guided-Reef-Snorkeling-Tour-4.webp',
    '/images/snorkeling-diving/Guided-Reef-Snorkeling-Tour-7.webp',
    '/images/snorkeling-diving/Turtle-On-Anglins-Pier-Reef-Fort-Lauderdale.webp',
  ];
  
  const paddleboardingImages = [
    '/images/paddleboarding/paddleboarding_florida5.webp',
    '/images/paddleboarding/paddleboarding_florida4.webp',
    '/images/paddleboarding/paddleboarding_florida.png',
    '/images/paddleboarding/paddleboarding_florida2.png',
    '/images/paddleboarding/paddleboarding_florida3.png',
    '/images/paddleboarding/paddleboarding_florida6.webp',
    '/images/paddleboarding/paddleboarding_florida7.png',
    '/images/paddleboarding/paddleboarding_florida8.jpg',
    '/images/paddleboarding/paddleboarding_florida9.png',
    '/images/paddleboarding/paddleboarding_florida10.png',
    '/images/paddleboarding/paddleboarding_florida11.jpg',
  ];
  
  const categories = [
    { id: 'surfing', name: 'Surf Lessons', images: surfingImages },
    { id: 'snorkeling', name: 'Snorkeling & Diving', images: snorkelingDivingImages },
    { id: 'paddleboarding', name: 'Paddleboarding', images: paddleboardingImages }
  ];
  
  const activeCategory = categories.find(cat => cat.id === activeTab);
  
  const handleImageClick = (src) => {
    setSelectedImage(src);
  };
  
  const closeModal = () => {
    setSelectedImage(null);
  };
  
  return (
    <div id="gallery" className="animate-fadeInUp w-full">
      <div className="mb-8">
        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {categories.map((category, index) => (
              <button
                key={category.id}
                type="button"
                className={`px-5 py-2.5 text-sm font-medium ${
                  index === 0 ? 'rounded-l-lg' : ''
                } ${
                  index === categories.length - 1 ? 'rounded-r-lg' : ''
                } transition-all duration-200 ${
                  activeTab === category.id
                    ? 'bg-[#005d8e] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {activeCategory && (
        <div className="mb-16 w-full">
          <div className="flex justify-center">
            <h2 className="text-4xl font-extrabold mb-10 text-center text-black pb-2 border-b-4 border-[#005d8e] tracking-tight">{activeCategory.name}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mx-4">
            {activeCategory.images.map((src, index) => (
              <div key={index} className="w-full">
                <div 
                  className="relative rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  style={{height: '300px'}}
                  onClick={() => handleImageClick(src)}
                >
                  <Image
                    src={src}
                    alt={`Vibe Surf School ${activeTab} image ${index + 1}`}
                    fill
                    className="object-cover object-center hover:scale-105 transition-transform duration-300"
                    quality={85}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
                    priority={index < 6}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4" onClick={closeModal}>
          <div className="relative max-w-6xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
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
                quality={90}
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}