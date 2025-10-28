'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSectionClick = (sectionId: string) => {
    if (pathname === '/') {
      // If already on home page, use smaller offset (going too far down)
      const element = document.getElementById(sectionId);
      if (element) {
        const scrollOffset = 200; // Offset to scroll up more
        const elementPosition = element.offsetTop - scrollOffset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // If on another page, use different offsets for different sections
      router.push(`/#${sectionId}`);
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          // Different offsets for different sections
          const scrollOffset = sectionId === 'how-it-works' ? 1500 : 300;
          const elementPosition = element.offsetTop + scrollOffset;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }, 800);
    }
  };

  const handleBurnHistoryClick = () => {
    if (pathname === '/') {
      const element = document.getElementById('burn-history');
      if (element) {
        const scrollOffset = 200;
        const elementPosition = element.offsetTop - scrollOffset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    } else {
      router.push(`/#burn-history`);
      setTimeout(() => {
        const element = document.getElementById('burn-history');
        if (element) {
          const scrollOffset = 300;
          const elementPosition = element.offsetTop + scrollOffset;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }, 800);
    }
  };

  // Handle hash scrolling when page loads
  useEffect(() => {
    if (pathname === '/' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      // Wait for page to fully load and render
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const headerHeight = 80; // Medium offset for hash scrolling
          const elementPosition = element.offsetTop - headerHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  }, [pathname]);
  return (
    <header className="border-b-2 border-red-400 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
            <div className="relative">
              <img src="/ProfilePicBurn.jpg" alt="BurnFlow Logo" className="w-16 h-16" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-300 font-mono tracking-wider">BURNFLOW</h1>
              <p className="text-xs text-red-400 font-mono tracking-widest">[AUTOMATED TOKEN BURN ALGORITHM]</p>
            </div>
          </a>
          <div className="flex items-center space-x-3">
            <button
              className="bg-orange-700 text-gray-200 px-4 py-2 rounded font-mono text-sm font-semibold hover:bg-orange-600 hover:text-white transition-colors tracking-wider cursor-pointer border border-orange-600/30"
              onClick={() => handleSectionClick('how-it-works')}
            >
              HOW IT WORKS
            </button>
            <button
              className="bg-red-700 text-gray-200 px-4 py-2 rounded font-mono text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors tracking-wider cursor-pointer border border-red-600/30"
              onClick={handleBurnHistoryClick}
            >
              BURN HISTORY
            </button>
            <a
              href="https://x.com/RewardFlow1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-red-400 hover:text-orange-400 transition-colors font-mono text-sm tracking-wider"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="lucide lucide-x"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
              <span>[ FOLLOW ]</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
