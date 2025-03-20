'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Define your gallery images here
  const slideImages = [
    '/images/exterior-views/dji_fly_20240706_141140_39_1720273902484_photo.jpg',
    '/images/exterior-views/1.jpg',
    '/images/exterior-views/2.jpg',
    '/images/exterior-views/5.jpg',
    '/images/exterior-views/6.jpg',
    '/images/herolds-bay-surroundings/DSC_2026.JPG',
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slideImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideImages.length - 1 : prev - 1));
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000); // Change slide every 6 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      {/* Full-width hero container */}
      <div className="relative w-full h-[90vh] overflow-hidden">
        {/* Images and overlay */}
        {slideImages.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`Vibe Beach House Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
          </div>
        ))}
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
          <div className="text-center animate-fadeIn">
            {/* Beach House Logo */}
            <div className="mb-11 flex justify-center">
              <div className="w-15 h-15 border-3 border-white flex items-center justify-center rounded-full bg-[#005d8e] shadow-lg overflow-hidden">
                <Image 
                  src="/images/beach-house-logo.svg" 
                  alt="Vibe Beach House Logo"
                  width={300}
                  height={300}
                  style={{
                    maxWidth: "105%",
                    height: "auto"
                  }}
                  priority
                />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
              VIBE BEACH HOUSE
            </h1>
            <p className="text-xl md:text-2xl text-white/90 tracking-widest uppercase mb-10">
              Your Luxury Getaway in Herolds Bay
            </p>
            <a
              href="https://www.airbnb.com/rooms/1185679450503007200?source_impression_id=p3_1742350524_P3ntnWSMNQoPAbvn"
              className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white px-8 py-4 rounded-sm text-lg font-semibold transition-colors shadow-md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Your Stay
            </a>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-20 bg-black/20 hover:bg-black/40 p-2 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="h-8 w-8" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white z-20 bg-black/20 hover:bg-black/40 p-2 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="h-8 w-8" />
        </button>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slideImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-[#005d8e]' : 'bg-white/60 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Feature highlights */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#005d8e]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">3 Bedrooms</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#005d8e]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">Ocean Views</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#005d8e]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">Swimming Pool</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#005d8e]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">WiFi (50Mbps)</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#005d8e]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">Braai Area</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#005d8e]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">Luxury Amenities</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-800 text-lg mb-6">Comfortably sleeps up to 8 people • Starting from R2,500 per night</p>
            <a
              href="https://www.airbnb.com/rooms/1185679450503007200?source_impression_id=p3_1742350524_P3ntnWSMNQoPAbvn"
              className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white font-medium py-3 px-8 rounded-sm transition-colors shadow-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Your Stay
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}