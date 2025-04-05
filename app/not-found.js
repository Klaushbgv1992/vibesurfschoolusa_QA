import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | Vibe Surf School',
  description: 'Sorry, the page you are looking for could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          We can't find the page you're looking for. The page may have been moved, deleted, or might never have existed.
        </p>
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors shadow-md"
          >
            Go Home
          </Link>
          <div className="pt-4">
            <Link 
              href="/vibe-surf-blog"
              className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              Read Our Blog
            </Link>
            <span className="mx-2 text-gray-400">|</span>
            <a 
              href="https://vibesurfschool.setmore.com/fortlauderdale" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              Book a Lesson
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
