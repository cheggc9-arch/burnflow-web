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
              href="/formula"
              className="text-green-400 hover:text-cyan-400 transition-colors font-mono text-sm tracking-wider"
            >
              [ FORMULA ]
            </a>
            <a
              href="https://x.com/hold2earnsol"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-green-400 hover:text-cyan-400 transition-colors font-mono text-sm tracking-wider"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-twitter"
                aria-hidden="true"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
              <span>[ CONNECT ]</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
