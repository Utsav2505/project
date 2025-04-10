
import Link from "next/link";
import { Home, MessageSquare, Info } from "lucide-react";

export function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-xl font-bold"
              aria-label="Home"
            >
              <MessageSquare className="h-8 w-8" />
              <span>Feedback Hub</span>
            </Link>
          </div>

          
          <div className="hidden sm:flex items-center space-x-4">
            <Link 
              href="/" 
              className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
              aria-label="Home page"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              href="/admin" 
              className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
              aria-label="Admin dashboard"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/about" 
              className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
              aria-label="About page"
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              type="button"
              className="p-2 rounded-md hover:bg-blue-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}