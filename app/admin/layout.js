"use client";
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';

// Import global styles but not the main site components
import '../globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated on client-side
    const authStatus = localStorage.getItem('vibeAdminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else if (pathname !== '/admin/login') {
      // Redirect to login if not authenticated and not already on login page
      router.push('/admin/login');
    }
    setIsLoading(false);
  }, [pathname, router]);

  // Show loading state
  if (isLoading) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </body>
      </html>
    );
  }

  // If on login page or authenticated, show content with admin-specific layout
  if (pathname === '/admin/login' || isAuthenticated) {
    return (
      <html lang="en">
        <body className={`${inter.className} antialiased bg-gray-50`}>
          {children}
        </body>
      </html>
    );
  }

  // Fallback blank page while redirecting
  return null;
}
