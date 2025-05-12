"use client";

import Link from 'next/link';
import { useAuth } from '@/app/lib/auth';

export default function Header() {
  const { user, signOut, loading } = useAuth();

  return (
    <header className="bg-blue-600 text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Violation Tracker
        </Link>

        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            
            {user && (
              <li>
                <Link href="/tracker" className="hover:underline">
                  Tracker
                </Link>
              </li>
            )}

            {!loading && (
              <>
                {user ? (
                  <li>
                    <button 
                      onClick={signOut}
                      className="hover:underline"
                    >
                      Logout ({user.email})
                    </button>
                  </li>
                ) : (
                  <li>
                    <Link href="/login" className="hover:underline">
                      Login
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}