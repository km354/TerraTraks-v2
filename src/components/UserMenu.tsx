'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * User Menu Component
 * 
 * Shows user info and sign out option when logged in
 */
export default function UserMenu() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        setSession(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    setSession(null);
    setIsOpen(false);
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="inline-flex items-center px-5 py-2.5 border-2 border-sage text-sm font-medium rounded-lg text-offwhite bg-sage/20">
        <div className="h-5 w-5 mr-2 animate-pulse bg-sage-light rounded"></div>
        <span className="hidden sm:inline">Loading...</span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/auth/signin"
        className="inline-flex items-center px-5 py-2.5 border-2 border-sage text-sm font-medium rounded-lg text-offwhite bg-sage/20 hover:bg-sage/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky transition-colors"
      >
        <svg
          className="h-5 w-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        Sign In
      </Link>
    );
  }

  const user = session.user;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border-2 border-sage text-sm font-medium rounded-lg text-offwhite bg-sage/20 hover:bg-sage/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky transition-colors"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || 'User'}
            className="h-8 w-8 rounded-full mr-2"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-sage-light mr-2 flex items-center justify-center">
            <span className="text-forest font-semibold text-sm">
              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        )}
        <span className="hidden sm:inline">{user.name || user.email}</span>
        <svg
          className={`h-4 w-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-sage/20">
            <div className="px-4 py-3 border-b border-sage/20">
              <p className="text-sm font-semibold text-forest">{user.name}</p>
              <p className="text-sm text-forest/70 truncate">{user.email}</p>
            </div>
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-forest hover:bg-sage/10 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-forest hover:bg-sage/10 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

