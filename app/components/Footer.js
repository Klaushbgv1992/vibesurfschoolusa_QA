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
      url: 'https://www.instagram.com/',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    { 
      name: 'Facebook', 
      url: 'https://www.facebook.com/',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    { 
      name: 'Airbnb', 
      url: 'https://www.airbnb.com/rooms/1185679450503007200?source_impression_id=p3_1742350524_P3ntnWSMNQoPAbvn',
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.213 13.212c-.08.196-.212.388-.376.567-.768.768-2.268 1.268-4.457.118-1.801-.951-3.541-2.493-4.919-4.544-1.872-2.304-1.976-3.88-1.04-4.816.188-.189.42-.321.675-.401.098-.032.168-.032.218-.032 1.759 0 3.32 5.246 3.32 5.246S12.696 4.435 14.3 4.435c.099 0 .2.012.296.034.525.132.862.533.948 1.098.147 1.156-.694 2.696-1.376 4.166a.09.09 0 00.039.115.09.09 0 00.119-.03c.889-1.622 1.939-3.602 1.789-5.066-.099-.855-.647-1.587-1.493-1.995-.219-.105-.471-.162-.73-.162-2.373 0-4.955 5.527-4.955 5.527S7.09 3.051 5.079 3.051c-.201 0-.382.019-.562.055-.647.136-1.174.525-1.503 1.128-.773 1.533-.044 3.936 1.734 6.865.893 1.449 2.017 2.881 3.254 4.117 1.28 1.28 2.68 2.348 4.064 3.205.703.423 1.378.744 2.011.946 1.427.428 2.687.321 3.547-.318.334-.232.593-.539.744-.903.217-.521.222-1.096.014-1.701-.509-1.449-2.148-3.263-2.148-3.263s-.366-.347-.61-.347c-.245 0-.371.327-.371.327s1.531 1.841 1.962 3.146c.142.423.149.798.024 1.068-.094.2-.25.363-.465.497-.709.419-1.811.444-3.152-.069-.626-.242-1.313-.589-2.06-1.057-1.368-.842-2.751-1.884-4.017-3.151-1.211-1.21-2.329-2.631-3.227-4.072-1.557-2.499-2.293-4.583-1.56-5.958.169-.296.421-.509.729-.61.122-.031.259-.052.381-.052 1.503 0 3.728 3.227 3.728 3.227s.23.345.572.345.577-.345.577-.345-.366-.741-1.066-1.792C5.617 3.597 3.83 1.2 2.199 1.2c-.174 0-.357.019-.54.062-.633.151-1.193.522-1.607 1.078C-.991 3.825-.465 6.811 1.515 10.001c.85 1.339 1.885 2.635 3.076 3.825 1.219 1.219 2.536 2.208 3.909 3.045 1.321.796 2.635 1.364 3.91 1.69.526.135 1.04.203 1.545.203 1.042 0 2.019-.301 2.797-.9.52-.398.941-.941 1.219-1.595.333-.756.329-1.595-.008-2.39-.713-1.676-2.16-3.387-2.16-3.387s-.358-.28-.646-.28c-.188 0-.295.075-.37.142-.094.084-.141.203-.141.326 0 .125.047.244.141.329.047.066.154.14.342.14.192 0 .398-.188.398-.188s1.358 1.506 1.93 2.865c.18.427.2.814.061 1.124z"/>
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
              offering stunning ocean views and the perfect location to explore the Garden Route.
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