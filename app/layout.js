import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata = {
  title: 'Vibe Surf School - Fort Lauderdale, Florida',
  description: 'Learn to surf with experienced instructors at Vibe Surf School in Fort Lauderdale, Florida. Professional surf lessons for all skill levels in a fun, safe environment.',
  icons: {
    icon: [
      { url: '/images/vibe-surfschool-logo.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/images/vibe-surfschool-logo.svg',
    apple: '/images/vibe-surfschool-logo.svg',
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