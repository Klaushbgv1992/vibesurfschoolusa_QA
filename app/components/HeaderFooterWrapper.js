"use client";
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function HeaderFooterWrapper({ children }) {
  // Use Next.js's usePathname hook for more reliable path detection
  const pathname = usePathname();
  const isAdmin = pathname && pathname.includes('/admin');
  
  if (isAdmin) {
    // For admin pages, don't show header/footer
    return <main className="min-h-screen w-full">{children}</main>;
  }
  
  // For regular pages, show header/footer
  return (
    <>
      <Header />
      <main className="min-h-screen w-full">{children}</main>
      <Footer />
    </>
  );
}
