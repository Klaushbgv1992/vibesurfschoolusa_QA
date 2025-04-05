import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import SchemaOrg from './components/SchemaOrg';
import HiddenStructuredData from './components/HiddenStructuredData';
import GoogleAnalytics from './components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata = {
  title: 'Vibe Surf School - Learn to Surf in Florida',
  description: 'Surf lessons for all ages at Florida\'s top surf school. Book your surf experience now!',
  metadataBase: new URL('https://www.vibesurfschool.com'),
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  icons: {
    icon: [
      { url: '/images/vibe-surfschool-logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/images/vibe-surfschool-logo.svg',
    apple: '/images/vibe-surfschool-logo.svg',
  },
  // Open Graph metadata
  openGraph: {
    title: 'Vibe Surf School',
    description: 'Surf lessons for all ages at Florida\'s top surf school. Book your surf experience now!',
    url: '/',
    siteName: 'Vibe Surf School',
    images: [
      {
        url: '/images/surfing/Testimonials.png',
        width: 1200,
        height: 630,
        alt: 'Vibe Surf School - Fort Lauderdale',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Vibe Surf School',
    description: 'Surf lessons for all ages at Florida\'s top surf school. Book your surf experience now!',
    images: ['/images/surfing/Testimonials.png'],
  },
};

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-PX1TWSZJ9C';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <SchemaOrg />
        <HiddenStructuredData />
        <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
      </head>
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
        <Header />
        <main className="min-h-screen w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}