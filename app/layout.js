import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata = {
  title: 'Vibe Beach House - Herolds Bay, South Africa',
  description: 'Experience luxury self-catering accommodation at Vibe Beach House in Herolds Bay, South Africa. Perfect location for a relaxing getaway with stunning ocean views.',
  icons: {
    icon: [
      { url: '/images/beach-house-logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/images/beach-house-logo.svg',
    apple: '/images/beach-house-logo.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
        <Header />
        <main className="min-h-screen w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}