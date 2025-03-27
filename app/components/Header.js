'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const isGalleryPage = pathname === '/gallery';
  const isBlogPage = pathname === '/blog' || pathname.startsWith('/blog/');
  const isLightBgPage = isGalleryPage || isBlogPage;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getTextColor = () => {
    if (isLightBgPage) {
      return isScrolled ? 'text-gray-800' : 'text-gray-800';
    }
    return isScrolled ? 'text-gray-800' : 'text-white';
  };

  const socialLinks = [
    { 
      name: 'YouTube', 
      url: 'https://www.youtube.com/channel/UCE71lChjsWva7_pr6IREGMw',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
        </svg>
      )
    },
    { 
      name: 'Facebook', 
      url: 'https://www.facebook.com/people/Vibe-Surf-School-USA/61554172934755/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      name: 'Twitter/X', 
      url: 'https://x.com/VibeSurfSchool',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      )
    },
    { 
      name: 'Instagram', 
      url: 'https://www.instagram.com/vibesurfschool.usa',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@vibe.surf.school/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 015.16-1.74L12.33 16a4.34 4.34 0 00-8.65.84 4.34 4.34 0 108.42-1.48V9.65a6.32 6.32 0 004.69 1.91V8.05c-.52-.05-1.05-.17-1.55-.36a4.84 4.84 0 01-1.52-1.02l.18.02z"/>
        </svg>
      )
    },
    { 
      name: 'LinkedIn', 
      url: 'https://www.linkedin.com/company/vibe-surf-school',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isLightBgPage ? 'bg-white/90 backdrop-blur-sm shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className={`${isLightBgPage ? 'w-full' : 'container mx-auto'} flex justify-end items-center py-4 px-4`}>
          {/* All Content in One Group - Aligned Right */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className={`font-medium transition-colors ${getTextColor()}`}>
                Home
              </Link>
              <Link href="/about" className={`font-medium transition-colors ${getTextColor()}`}>
                About
              </Link>
              <Link href="/locations" className={`font-medium transition-colors ${getTextColor()}`}>
                Locations
              </Link>
              <Link href="/gallery" className={`font-medium transition-colors ${getTextColor()}`}>
                Gallery
              </Link>
              <Link href="/merchandise" className={`font-medium transition-colors ${getTextColor()}`}>
                Merchandise
              </Link>
              <Link href="/surfcams" className={`font-medium transition-colors ${getTextColor()}`}>
                Surf Cams
              </Link>
              <Link href="/forecast" className={`font-medium transition-colors ${getTextColor()}`}>
                Forecast
              </Link>
              <Link href="/blog" className={`font-medium transition-colors ${getTextColor()}`}>
                Blog
              </Link>
              <Link href="/contact" className={`font-medium transition-colors ${getTextColor()}`}>
                Contact
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`transition-colors ${getTextColor()}`}
              >
                {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </button>
            </div>

            {/* Social Icons & Book Button */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex space-x-3">
                {socialLinks.map((link, index) => (
                  <a key={index} href={link.url} className={`transition-colors ${getTextColor()}`}>
                    {link.icon}
                  </a>
                ))}
              </div>
              <a 
                href="https://vibesurfschool.setmore.com/fortlauderdale" 
                className="bg-[#005d8e] hover:bg-[#00486e] text-white px-4 py-2 rounded-sm text-sm font-semibold transition-colors shadow-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md">
            <nav className="flex flex-col py-4">
              <Link href="/" className="text-gray-800 hover:bg-gray-100 py-2 px-4 text-right">
                Home
              </Link>
              <Link href="/about" className="text-gray-800 hover:bg-gray-100 py-2 px-4 text-right">
                About
              </Link>
              <Link href="/locations" className="text-gray-800 hover:bg-gray-100 py-2 px-4 text-right">
                Locations
              </Link>
              <Link href="/gallery" className="text-gray-800 hover:bg-gray-100 py-2 px-4 text-right">
                Gallery
              </Link>
              <Link href="/merchandise" className="text-gray-800 hover:bg-gray-100 py-2 px-4 text-right">
                Merchandise
              </Link>
              <Link href="/surfcams" className="text-gray-800 hover:bg-gray-100 py-2 px-4 text-right">
                Surf Cams
              </Link>
              <Link href="/forecast" className="text-gray-800 hover:bg-gray-100 py-2 px-4 text-right">
                Forecast
              </Link>
              <Link href="/blog" className="text-gray-800 hover:bg-gray-100 py-2 px-4 text-right">
                Blog
              </Link>
              <Link href="/contact" className="text-gray-800 hover:bg-gray-100 py-2 px-4 text-right">
                Contact
              </Link>
              <div className="border-t border-gray-200 mt-2 pt-2 px-4 flex justify-end">
                <a 
                  href="https://vibesurfschool.setmore.com/fortlauderdale" 
                  className="bg-[#005d8e] hover:bg-[#00486e] text-white px-4 py-2 rounded-sm text-sm font-semibold transition-colors shadow-sm inline-block mt-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Now
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}