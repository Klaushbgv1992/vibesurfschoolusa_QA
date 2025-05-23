"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call the logout API to clear the server-side cookie
      const response = await fetch('/api/admin/login', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Also clear from localStorage for client-side state
      localStorage.removeItem('vibeAdminAuth');
      
      // Redirect to login page
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still try to logout client-side even if API call fails
      localStorage.removeItem('vibeAdminAuth');
      router.push('/admin/login');
    }
  };

  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin/bookings" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">Vibe Surf Admin</span>
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/admin/bookings" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Bookings
              </Link>
              {/* Add more admin links here as needed */}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
