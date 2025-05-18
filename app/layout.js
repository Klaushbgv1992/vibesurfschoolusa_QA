import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import SchemaOrg from './components/SchemaOrg';
import HiddenStructuredData from './components/HiddenStructuredData';
import GoogleAnalytics from './components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

// Separate viewport export per Next.js best practices
export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata = {
  title: 'Vibe Surf School - Learn to Surf in Florida',
  description: 'Surf lessons for all ages at Florida\'s top surf school. Book your surf experience now!',
  metadataBase: new URL('https://www.vibesurfschool.com'),
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

import PayPalProviderClient from "./components/PayPalProviderClient";

export default function RootLayout({ children }) {
  // Use server-side env var for clientId
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  if (!paypalClientId) {
    console.error('Missing PayPal Client ID! Please check your .env.local and restart the dev server.');
  }
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Force canonical URL for better SEO */}
        <SchemaOrg />
        <HiddenStructuredData />
        <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
      </head>
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
        {paypalClientId ? (
          <PayPalProviderClient clientId={paypalClientId}>
            <Header />
            <main className="min-h-screen w-full">{children}</main>
            <Footer />
          </PayPalProviderClient>
        ) : (
          <div style={{ color: 'red', padding: 32, textAlign: 'center' }}>
            PayPal integration error: Missing Client ID. Please check your .env.local and restart the server.
          </div>
        )}
      </body>
    </html>
  );
}