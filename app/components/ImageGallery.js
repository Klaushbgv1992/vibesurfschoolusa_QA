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
    '/images/exterior-views/19.jpg',
    '/images/exterior-views/20240706_134831.jpg',
    '/images/exterior-views/20240706_140013.jpg',
    '/images/exterior-views/20240706_140020.jpg',
    '/images/exterior-views/20240706_140028.jpg',
    '/images/exterior-views/20240706_140039.jpg',
    '/images/exterior-views/20240706_140044.jpg',
    '/images/exterior-views/20240706_140051.jpg',
    '/images/exterior-views/20240706_140058.jpg',
    '/images/exterior-views/20240706_140107.jpg',
    '/images/exterior-views/20240706_140121.jpg',
    '/images/exterior-views/20240706_140152.jpg',
    '/images/exterior-views/20240706_140443.jpg',
    '/images/exterior-views/dji_fly_20240706_141126_38_1720273904195_photo_resized.jpg',
    '/images/exterior-views/dji_fly_20240706_141140_39_1720273902484_photo.jpg',
    '/images/exterior-views/dji_fly_20240706_141534_49_1720273883894_photo.jpg',
    '/images/exterior-views/25e4578d5774cd548d2a383524eed182_-1_1720282166487.jpg',
    '/images/exterior-views/92fa37d4aed901e9541231cbda00f989_-1_1720283089291.jpg',
    
  ];
  
  const interiorImages = [
    '/images/interior-views/5-a.jpg',
    '/images/interior-views/5b.jpg',
    '/images/interior-views/7.jpg',
    '/images/interior-views/8.jpg',
    '/images/interior-views/8-b.jpg',
    '/images/interior-views/10.jpg',
    '/images/interior-views/10aa.jpg',
    '/images/interior-views/10b.jpg',
    '/images/interior-views/11.jpg',
    '/images/interior-views/12.jpg',
    '/images/interior-views/13.jpg',
    '/images/interior-views/14.jpg',
    '/images/interior-views/14-a.jpg',
    '/images/interior-views/15.jpg',
    '/images/interior-views/16-a.jpg',
    '/images/interior-views/16-b.jpg',
    '/images/interior-views/18.jpg',
    '/images/interior-views/20.jpg',
    '/images/interior-views/23a.jpeg',
    '/images/interior-views/23b.jpg',
    '/images/interior-views/23c.jpg',
    '/images/interior-views/22.jpg',
    '/images/interior-views/25.jpg',
    '/images/interior-views/26.jpg',
    '/images/interior-views/27.jpg',
    '/images/interior-views/28.jpg',
    '/images/interior-views/29.jpg',
    '/images/interior-views/30.jpg',
    '/images/interior-views/30-a.jpg',
    '/images/interior-views/31.jpg',
    '/images/interior-views/32.jpg',
    '/images/interior-views/33.jpg',
    '/images/interior-views/33b.jpg',
    '/images/interior-views/33c.jpg',
    '/images/interior-views/20240706_135009.jpg',
    '/images/interior-views/20240706_135015.jpg',
    '/images/interior-views/20240706_135749.jpg',
    '/images/interior-views/20240706_140415.jpg',
    '/images/interior-views/WhatsApp Image 2024-06-23 at 08.45.35.jpeg',
    '/images/interior-views/WhatsApp Image 2024-07-07 at 07.54.55.jpeg',
    '/images/interior-views/WhatsApp Image 2024-07-07 at 07.55.21.jpeg',
    '/images/interior-views/WhatsApp Image 2024-07-07 at 11.16.39.jpeg',
    '/images/interior-views/WhatsApp Image 2024-07-07 at 11.16.41 (1).jpeg',
    '/images/interior-views/WhatsApp Image 2024-07-07 at 11.16.41.jpeg',
  ];
  
  const surroundingImages = [
    '/images/herolds-bay-surroundings/WhatsApp Image 2024-07-07 at 21.22.43.jpeg',
    '/images/herolds-bay-surroundings/WhatsApp Image 2024-07-07 at 21.22.41.jpeg',
    '/images/herolds-bay-surroundings/DSC_2026.JPG',
    '/images/herolds-bay-surroundings/IMG_20190213_061801.jpg',
    '/images/herolds-bay-surroundings/WhatsApp Image 2024-07-07 at 21.22.42.jpeg',
    '/images/herolds-bay-surroundings/10830583_10153071248707188_821919165144872133_o.jpg',
    '/images/herolds-bay-surroundings/10911522_10153071248387188_5268877696023379232_o.jpg',
    '/images/herolds-bay-surroundings/12615606_10153906152637188_5149687760016042402_o.jpg',
    '/images/herolds-bay-surroundings/12640252_10153905342977188_415745675972112875_o.jpg',
    '/images/herolds-bay-surroundings/IMG_20190204_125636.jpg',
    '/images/herolds-bay-surroundings/IMG-20190106-WA0048.jpg',
    '/images/herolds-bay-surroundings/IMG_2660.JPG',
    '/images/herolds-bay-surroundings/DYHQ7043.JPG',
    '/images/herolds-bay-surroundings/NHPJ6975.JPG',
    '/images/herolds-bay-surroundings/IQWW5273.JPG',
    '/images/herolds-bay-surroundings/GEIQ2572.JPG',
    '/images/herolds-bay-surroundings/DSC_2166.JPG',
    '/images/herolds-bay-surroundings/15776738_10154904405147188_5130475437002451600_o.jpg',
    '/images/herolds-bay-surroundings/136961822_10159112120307188_7431952625242323419_n.jpg',
    '/images/herolds-bay-surroundings/137532049_10159112245042188_2967722682779859448_n.jpg',
    '/images/herolds-bay-surroundings/WhatsApp Image 2024-07-07 at 21.22.41 (1).jpeg',
    '/images/herolds-bay-surroundings/WhatsApp Image 2024-07-07 at 21.22.41 (2).jpeg',
    '/images/herolds-bay-surroundings/WhatsApp Image 2024-07-07 at 21.22.41 (3).jpeg',
    '/images/herolds-bay-surroundings/WhatsApp Image 2024-07-07 at 21.22.42 (1).jpeg',
    '/images/herolds-bay-surroundings/WhatsApp Image 2024-07-07 at 21.22.43 (1).jpeg',
    '/images/herolds-bay-surroundings/WhatsApp Image 2024-07-07 at 22.32.08.jpeg',
    '/images/herolds-bay-surroundings/450109135_975518961250619_5241044235292359095_n.jpg',
  ];
  
  const categories = [
    { id: 'exterior', name: 'Exterior Views', images: exteriorImages },
    { id: 'interior', name: 'Interior Spaces', images: interiorImages },
    { id: 'surroundings', name: 'Herolds Bay', images: surroundingImages }
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
            {categories.map(category => (
              <button
                key={category.id}
                type="button"
                className={`px-5 py-2.5 text-sm font-medium ${
                  category.id === 'exterior' ? 'rounded-l-lg' : ''
                } ${
                  category.id === 'surroundings' ? 'rounded-r-lg' : ''
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
          <h2 className="text-3xl font-bold mb-10 text-center">{activeCategory.name}</h2>
          
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
                    alt={`Vibe Beach House ${activeTab} image ${index + 1}`}
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
                sizes="100vw"
                quality={90}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}