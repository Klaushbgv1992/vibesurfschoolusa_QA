'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Define your gallery images here
  const slideImages = [
    '/images/surfing/Testimonials.png',
    '/images/surfing/IMG_9109.JPG',
    '/images/surfing/202428.jpg',
    '/images/surfing/DSC_0232_Original.jpg',
    '/images/surfing/IMG_6552.JPG',
    '/images/surfing/202421.jpg',
    '/images/surfing/202426.JPG'
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
              alt={`Vibe Surf School Slide ${index + 1}`}
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
            {/* Surf School Logo */}
            <div className="mb-10 md:mb-11 flex justify-center">
              <div className="w-40 h-40 md:w-48 md:h-48 border-3 border-white flex items-center justify-center rounded-full bg-[#005d8e] shadow-lg overflow-hidden">
                <Image 
                  src="/images/vibe-surfschool-logo.svg" 
                  alt="Vibe Surf School Logo"
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
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 md:mb-6">
              VIBE SURF SCHOOL
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 tracking-widest uppercase mb-8 md:mb-10">
              Learn To Surf in Fort Lauderdale
            </p>
            <a
              href="/booking"
              className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-sm text-lg font-semibold transition-colors shadow-md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book A Lesson
            </a>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white z-20 bg-black/20 hover:bg-black/40 p-1 sm:p-2 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white z-20 bg-black/20 hover:bg-black/40 p-1 sm:p-2 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="h-6 w-6 sm:h-8 sm:w-8" />
        </button>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-16 sm:bottom-12 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slideImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">Individual Lessons</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#005d8e]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">Group Lessons</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#005d8e]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">Affordable Rates</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#005d8e]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">Certified Instructors</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#005d8e]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">All Equipment Provided</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#005d8e]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </div>
              <p className="text-gray-800 font-medium">Year-round Lessons</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}