'use client';

export default function Header() {
  return (
    <header className="border-b-2 border-green-400 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded border-2 border-green-400 bg-black flex items-center justify-center">
                <div className="text-green-400 font-mono text-xl font-bold">M</div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold pump-gradient-text font-mono tracking-wider">MATRIX</h1>
              <p className="text-xs text-green-400 font-mono tracking-widest">[ REWARDS ]</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="#how-it-works"
              className="bg-green-400 text-black px-4 py-2 rounded font-mono text-sm font-semibold hover:bg-yellow-400 transition-colors tracking-wider"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              HOW IT WORKS
            </a>
            <a
              href="/formula"
              className="bg-green-400 text-black px-4 py-2 rounded font-mono text-sm font-semibold hover:bg-yellow-400 transition-colors tracking-wider"
            >
              FORMULA
            </a>
            <a
              href="https://x.com/hold2earnsol"
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
