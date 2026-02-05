'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/auth/status')
      .then(response => {
        setIsLoggedIn(response.data.isLoggedIn);
        setLoading(false);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await axios.get('/api/users/logout')
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="animate-pulse text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md dark:bg-black/80 border-b border-zinc-200 dark:border-zinc-800 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            <Link href="/" className="flex items-center space-x-2">
            
              <span className="text-xl font-bold text-zinc-900 dark:text-white">ProfilY</span>
            </Link>

            {/* Nav Items - Conditional */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Link 
                    href="/profile" 
                    className="bg-indigo-900 dark:bg-indigo-800 text-white dark:text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition"
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="px-6 py-2 bg-zinc-900 text-white dark:bg-white dark:text-black rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-200 transition font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="px-4 py-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition font-medium"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-6 py-2 bg-zinc-900 text-white dark:bg-white dark:text-black rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-200 transition font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-full">
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Profile Made Simple
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-7xl font-bold text-zinc-900 dark:text-white leading-tight">
            You Deserve
            <span className="block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Your Way
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Create and manage your profile with ease. Sign up today and get started in seconds.
          </p>

          {/* CTA Buttons - Conditional */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isLoggedIn ? (
              <Link 
                href="/profile"
                className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-200 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                View My Profile
              </Link>
            ) : (
              <>
                <Link 
                  href="/register"
                  className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-200 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
                <Link 
                  href="/login"
                  className="px-8 py-4 bg-transparent border-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-lg font-semibold hover:border-zinc-400 dark:hover:border-zinc-600 transition"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}