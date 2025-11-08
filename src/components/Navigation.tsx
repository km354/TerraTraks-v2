'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import UserMenu to reduce initial bundle size
const UserMenu = dynamic(() => import('./UserMenu'), {
  ssr: false, // User menu requires client-side auth check
  loading: () => (
    <div className="h-10 w-10 bg-sage-light/30 rounded-full animate-pulse"></div>
  ),
});

/**
 * Navigation Component
 * 
 * Top navigation bar with links to key pages and user account
 */
export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-forest shadow-md border-b border-forest-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and Main Links */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-offwhite hover:text-sage-light transition-colors">
                🌲 TerraTraks
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link
                href="/new-itinerary"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive('/new-itinerary')
                    ? 'border-sky text-offwhite'
                    : 'border-transparent text-sage-light hover:text-offwhite hover:border-sage'
                }`}
              >
                Plan Trip
              </Link>
              <Link
                href="/pricing"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive('/pricing')
                    ? 'border-sky text-offwhite'
                    : 'border-transparent text-sage-light hover:text-offwhite hover:border-sage'
                }`}
              >
                Pricing
              </Link>
            </div>
          </div>

          {/* User Account / Login */}
          <div className="flex items-center">
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden border-t border-forest-dark">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/new-itinerary"
            className={`block pl-4 pr-4 py-3 border-l-4 text-base font-medium transition-colors ${
              isActive('/new-itinerary')
                ? 'bg-forest-light border-sky text-offwhite'
                : 'border-transparent text-sage-light hover:text-offwhite hover:bg-forest-light hover:border-sage'
            }`}
          >
            Plan Trip
          </Link>
          <Link
            href="/pricing"
            className={`block pl-4 pr-4 py-3 border-l-4 text-base font-medium transition-colors ${
              isActive('/pricing')
                ? 'bg-forest-light border-sky text-offwhite'
                : 'border-transparent text-sage-light hover:text-offwhite hover:bg-forest-light hover:border-sage'
            }`}
          >
            Pricing
          </Link>
        </div>
      </div>
    </nav>
  );
}

