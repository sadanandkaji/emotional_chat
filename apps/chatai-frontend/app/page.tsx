'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui/button';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Detect login from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f0c29] via-[#3f2b96] to-[#24243e] text-white font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10 bg-black/60 shadow-lg">
        <div className="container mx-auto px-6 sm:px-10 flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-primary animate-pulse" />
            <span className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent select-none">
              Stero
            </span>
          </div>

          <div className="hidden md:block text-white text-lg font-medium tracking-widest hover:tracking-[0.2em] transition-all duration-300 ease-in-out relative group">
            <span className="group-hover:underline underline-offset-4 decoration-primary decoration-2">
              CHAT WITH STERO
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Button
               size="lg"
                onClick={handleLogout}
                variant="not"
                className="rounded-full border border-red-500 hover:bg-red-600/40 text-white transition duration-300"
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                 size="lg"
                  onClick={() => router.push('/signin')}
                  variant="not"
                  className="rounded-full border border-white/20 text-white hover:bg-white/10 hover:scale-105 transition-transform duration-300"
                >
                  Login
                </Button>
                <Button
                 size="lg"
                  onClick={() => router.push('/signup')}
                  variant="not"
                  className="rounded-full border border-purple-500 bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-900/10 via-blue-700/10 to-blue-500/10 blur-2xl animate-pulse opacity-30" />

        <div className="max-w-3xl w-full bg-black/50 backdrop-blur-lg rounded-[2.5rem] p-14 sm:p-16 shadow-2xl border border-white/10 relative group transition-all duration-500">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-[2.5rem] z-0"></div>

          <div className="relative z-10 text-center">
            <Sparkles className="mx-auto h-20 w-20 text-primary animate-bounce mb-8 drop-shadow-xl" />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500 bg-clip-text text-transparent mb-6 tracking-tight">
              Experience NextGen AI Chat
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto mb-10 font-medium tracking-wide">
              Engage with our intelligent AI assistant powered by cutting-edge technology. Join now and witness the future of conversation.
            </p>

            <Button
              onClick={() => router.push('/rooms')}
              size="lg"
              variant="not"
              className="rounded-full border border-white/20 px-12 py-4 text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0c29] border-t border-white/10 py-14 mt-auto">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-gray-400 text-sm">
          <div>
            <div className="flex items-center gap-3 mb-5 text-white">
              <Sparkles className="h-7 w-7 text-primary drop-shadow-md" />
              <span className="text-2xl font-extrabold tracking-wide">Stero</span>
            </div>
            <p className="leading-relaxed max-w-xs">
              Next-generation AI chat platform for seamless communication.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide text-base">Product</h4>
            <ul className="space-y-2 cursor-pointer">
              <li className="hover:text-white/90 transition">Features</li>
              <li className="hover:text-white/90 transition">Pricing</li>
              <li className="hover:text-white/90 transition">API</li>
              <li className="hover:text-white/90 transition">Documentation</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide text-base">Company</h4>
            <ul className="space-y-2 cursor-pointer">
              <li className="hover:text-white/90 transition">About</li>
              <li className="hover:text-white/90 transition">Blog</li>
              <li className="hover:text-white/90 transition">Careers</li>
              <li className="hover:text-white/90 transition">Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide text-base">Legal</h4>
            <ul className="space-y-2 cursor-pointer">
              <li className="hover:text-white/90 transition">Privacy Policy</li>
              <li className="hover:text-white/90 transition">Terms of Service</li>
              <li className="hover:text-white/90 transition">Cookie Policy</li>
              <li className="hover:text-white/90 transition">Security</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-7 text-center text-xs text-gray-500 tracking-wide">
          &copy; {new Date().getFullYear()} Stero AI Chat. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
