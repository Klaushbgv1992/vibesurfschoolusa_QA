'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const isGalleryPage = pathname === '/gallery';
  
  const socialLinks = [
    { 
      name: 'Instagram', 
      url: 'https://www.instagram.com/vibebeachhouse/',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    { 
      name: 'Facebook', 
      url: 'https://www.facebook.com/people/Vibe-Beach-House/61562311770708/',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    { 
      name: 'Twitter/X', 
      url: 'https://x.com/vibebeachhouse/',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148 13.98 13.98 0 0 0 11.82 8.292a4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z"/>
        </svg>
      )
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@vibebeachhouse',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
      )
    },
    { 
      name: 'Airbnb', 
      url: 'https://www.airbnb.com/rooms/1185679450503007200?source_impression_id=p3_1742350524_P3ntnWSMNQoPAbvn',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.0001 9.15107C11.2464 9.15107 10.6236 9.76777 10.6236 10.5151C10.6236 11.2624 11.2464 11.8791 12.0001 11.8791C12.7537 11.8791 13.3765 11.2624 13.3765 10.5151C13.3765 9.76777 12.7573 9.15107 12.0001 9.15107ZM11.9677 2.42505C9.24748 2.42505 7.32181 3.39235 5.98427 4.80289C4.49371 6.35944 3.6077 8.76959 4.06826 11.8359C4.33896 13.7333 5.182 15.6343 6.57657 17.4957C7.74407 19.0523 9.11574 20.5685 10.6632 21.9358C11.0633 22.2942 11.5454 22.4275 11.9677 22.4275C12.39 22.4275 12.8757 22.2978 13.2722 21.9394C14.8197 20.5721 16.1913 19.0523 17.3589 17.4957C18.7534 15.6379 19.5965 13.7369 19.8672 11.8359C20.3241 8.77678 19.4417 6.35944 17.9511 4.80289C16.6101 3.38874 14.6879 2.42505 11.9677 2.42505ZM11.9713 20.225C11.8316 20.225 11.6954 20.1748 11.5557 20.0595C10.0723 18.7779 8.7673 17.3206 7.65957 15.8331C6.40182 14.1841 5.62522 12.4996 5.3904 10.8469C5.31036 10.1824 5.26634 9.45961 5.40313 8.78413C5.53992 8.11224 5.83269 7.48475 6.32922 6.98781C7.07385 6.24262 8.13761 5.79749 9.44753 5.79749C10.2671 5.79749 11.0417 6.02887 11.7574 6.48479C11.8681 6.55883 11.9533 6.64007 11.9749 6.64007C11.9929 6.64007 12.0817 6.55883 12.1925 6.48479C12.9045 6.02887 13.6791 5.79749 14.5023 5.79749C15.8123 5.79749 16.876 6.24262 17.6207 6.98781C18.1172 7.48475 18.41 8.11224 18.5468 8.78413C18.6835 9.456 18.6395 10.1824 18.5595 10.8469C18.3247 12.4996 17.5481 14.1841 16.2903 15.8331C15.1826 17.3206 13.8776 18.7815 12.3942 20.0595C12.2473 20.1748 12.111 20.225 11.9713 20.225Z" />
        </svg>
      )
    }
  ];
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className={`${isGalleryPage ? 'w-full px-6' : 'container mx-auto px-4'}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#005d8e] to-[#7fb5d1] bg-clip-text text-transparent mb-4">
                Vibe Beach House
              </h2>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
            Luxury self-catering accommodation in the heart of Herolds Bay, 
            offering a relaxed coastal ambiance and an ideal base for exploring the Garden Route.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-100">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors inline-block py-1">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#gallery" className="text-gray-400 hover:text-white transition-colors inline-block py-1">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-400 hover:text-white transition-colors inline-block py-1">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors inline-block py-1">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-100">Contact & Location</h3>
            <address className="not-italic text-gray-400">
              <p className="mb-2">6 Rooikransie St</p>
              <p className="mb-2">Herolds Bay</p>
              <p className="mb-2">George, 6615</p>
              <p className="mb-4">South Africa</p>
            </address>
            <a
              href="https://www.airbnb.com/rooms/1185679450503007200?source_impression_id=p3_1742350524_P3ntnWSMNQoPAbvn"
              className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Your Stay
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Vibe Beach House. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}