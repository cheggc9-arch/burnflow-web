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
    <header className="border-b-2 border-green-400 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
            <div className="relative">
              <img src="/ProfilePicMain.png" alt="RewardFlow Logo" className="w-16 h-16" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-300 font-mono tracking-wider">REWARDFLOW</h1>
              <p className="text-xs text-green-400 font-mono tracking-widest">[AUTOMATED OPEN SOURCE DISTRIBUTION]</p>
            </div>
          </a>
          <div className="flex items-center space-x-6">
            <button
              className="bg-green-400 text-black px-4 py-2 rounded font-mono text-sm font-semibold hover:bg-yellow-400 transition-colors tracking-wider cursor-pointer"
              onClick={() => handleSectionClick('how-it-works')}
            >
              HOW IT WORKS
            </button>
            <a
              href="/formula"
              className="bg-cyan-400 text-black px-4 py-2 rounded font-mono text-sm font-bold hover:bg-cyan-300 transition-all duration-300 tracking-wider border-2 border-cyan-300 shadow-lg hover:shadow-cyan-400/50"
            >
              FORMULA
            </a>
            <a
              href="/roadmap"
              className="bg-green-400 text-black px-4 py-2 rounded font-mono text-sm font-semibold hover:bg-yellow-400 transition-colors tracking-wider"
            >
              ROADMAP
            </a>
            <button
              className="bg-green-400 text-black px-4 py-2 rounded font-mono text-sm font-semibold hover:bg-yellow-400 transition-colors tracking-wider cursor-pointer"
              onClick={() => handleSectionClick('leaderboard')}
            >
              LEADERBOARD
            </button>
            <a
              href="/burn"
              className="bg-red-500 text-white px-4 py-2 rounded font-mono text-sm font-bold hover:bg-red-400 transition-colors tracking-wider"
            >
              REWARDFLOW BURN
            </a>
            <a
              href="https://x.com/RewardFlow1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-green-400 hover:text-yellow-400 transition-colors font-mono text-sm tracking-wider"
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
