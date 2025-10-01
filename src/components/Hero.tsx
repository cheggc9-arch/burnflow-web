'use client';

import ContractAddress from "./ContractAddress";

// Predefined matrix elements that loop continuously - defined outside component
const matrixElements = [
    { id: 1, left: 5, animationDelay: 0, animationDuration: 8, characters: ['010101', '110011', '001100', '101010', '011001'] },
    { id: 2, left: 15, animationDelay: 2, animationDuration: 8, characters: ['matrix', 'system', 'online', 'active', 'secure'] },
    { id: 3, left: 25, animationDelay: 4, animationDuration: 8, characters: ['0110', '1001', '1100', '0011', '1010'] },
    { id: 4, left: 35, animationDelay: 6, animationDuration: 8, characters: ['data', 'flow', 'code', 'byte', 'node'] },
    { id: 5, left: 45, animationDelay: 1, animationDuration: 8, characters: ['1111', '0000', '1010', '0101', '1100'] },
    { id: 6, left: 55, animationDelay: 3, animationDuration: 8, characters: ['enter', 'matrix', 'realm', 'digital', 'world'] },
    { id: 7, left: 65, animationDelay: 5, animationDuration: 8, characters: ['01101', '10010', '11001', '00110', '10101'] },
    { id: 8, left: 75, animationDelay: 7, animationDuration: 8, characters: ['cyber', 'space', 'grid', 'core', 'link'] },
    { id: 9, left: 85, animationDelay: 0.5, animationDuration: 8, characters: ['1110', '0001', '1011', '0100', '1101'] },
    { id: 10, left: 95, animationDelay: 2.5, animationDuration: 8, characters: ['neural', 'net', 'ai', 'bot', 'cpu'] },
    { id: 11, left: 10, animationDelay: 4.5, animationDuration: 8, characters: ['0111', '1000', '1011', '0100', '1101'] },
    { id: 12, left: 20, animationDelay: 6.5, animationDuration: 8, characters: ['data', 'sync', 'load', 'save', 'run'] },
    { id: 13, left: 30, animationDelay: 1.5, animationDuration: 8, characters: ['11110', '00001', '10110', '01001', '11010'] },
    { id: 14, left: 40, animationDelay: 3.5, animationDuration: 8, characters: ['cyber', 'punk', 'tech', 'hack', 'zone'] },
    { id: 15, left: 50, animationDelay: 5.5, animationDuration: 8, characters: ['01111', '10000', '10111', '01000', '11011'] },
    { id: 16, left: 60, animationDelay: 7.5, animationDuration: 8, characters: ['matrix', 'code', 'byte', 'data', 'flow'] },
    { id: 17, left: 70, animationDelay: 0.2, animationDuration: 8, characters: ['11100', '00011', '10100', '01011', '11000'] },
    { id: 18, left: 80, animationDelay: 2.2, animationDuration: 8, characters: ['neural', 'link', 'core', 'grid', 'node'] },
    { id: 19, left: 90, animationDelay: 4.2, animationDuration: 8, characters: ['01100', '10011', '11000', '00111', '10100'] },
    { id: 20, left: 12, animationDelay: 6.2, animationDuration: 8, characters: ['cyber', 'space', 'realm', 'world', 'zone'] },
    { id: 21, left: 22, animationDelay: 1.2, animationDuration: 8, characters: ['11101', '00010', '10101', '01010', '11001'] },
    { id: 22, left: 32, animationDelay: 3.2, animationDuration: 8, characters: ['matrix', 'system', 'online', 'active', 'secure'] },
    { id: 23, left: 42, animationDelay: 5.2, animationDuration: 8, characters: ['01110', '10001', '11010', '00101', '10110'] },
    { id: 24, left: 52, animationDelay: 7.2, animationDuration: 8, characters: ['data', 'flow', 'code', 'byte', 'node'] },
    { id: 25, left: 62, animationDelay: 0.8, animationDuration: 8, characters: ['11111', '00000', '10101', '01010', '11011'] },
    { id: 26, left: 72, animationDelay: 2.8, animationDuration: 8, characters: ['enter', 'matrix', 'realm', 'digital', 'world'] },
    { id: 27, left: 82, animationDelay: 4.8, animationDuration: 8, characters: ['01101', '10010', '11001', '00110', '10101'] },
    { id: 28, left: 92, animationDelay: 6.8, animationDuration: 8, characters: ['cyber', 'space', 'grid', 'core', 'link'] },
    { id: 29, left: 8, animationDelay: 1.8, animationDuration: 8, characters: ['11110', '00001', '10110', '01001', '11010'] },
    { id: 30, left: 18, animationDelay: 3.8, animationDuration: 8, characters: ['neural', 'net', 'ai', 'bot', 'cpu'] },
    { id: 31, left: 28, animationDelay: 5.8, animationDuration: 8, characters: ['01111', '10000', '10111', '01000', '11011'] },
    { id: 32, left: 38, animationDelay: 7.8, animationDuration: 8, characters: ['data', 'sync', 'load', 'save', 'run'] },
    { id: 33, left: 48, animationDelay: 0.3, animationDuration: 8, characters: ['11100', '00011', '10100', '01011', '11000'] },
    { id: 34, left: 58, animationDelay: 2.3, animationDuration: 8, characters: ['cyber', 'punk', 'tech', 'hack', 'zone'] },
    { id: 35, left: 68, animationDelay: 4.3, animationDuration: 8, characters: ['01100', '10011', '11000', '00111', '10100'] },
    { id: 36, left: 78, animationDelay: 6.3, animationDuration: 8, characters: ['matrix', 'code', 'byte', 'data', 'flow'] },
    { id: 37, left: 88, animationDelay: 1.3, animationDuration: 8, characters: ['11101', '00010', '10101', '01010', '11001'] },
    { id: 38, left: 98, animationDelay: 3.3, animationDuration: 8, characters: ['neural', 'link', 'core', 'grid', 'node'] },
    { id: 39, left: 3, animationDelay: 5.3, animationDuration: 8, characters: ['01110', '10001', '11010', '00101', '10110'] },
    { id: 40, left: 13, animationDelay: 7.3, animationDuration: 8, characters: ['cyber', 'space', 'realm', 'world', 'zone'] },
    { id: 41, left: 23, animationDelay: 0.7, animationDuration: 8, characters: ['11111', '00000', '10101', '01010', '11011'] },
    { id: 42, left: 33, animationDelay: 2.7, animationDuration: 8, characters: ['matrix', 'system', 'online', 'active', 'secure'] },
    { id: 43, left: 43, animationDelay: 4.7, animationDuration: 8, characters: ['01101', '10010', '11001', '00110', '10101'] },
    { id: 44, left: 53, animationDelay: 6.7, animationDuration: 8, characters: ['data', 'flow', 'code', 'byte', 'node'] },
    { id: 45, left: 63, animationDelay: 1.7, animationDuration: 8, characters: ['11110', '00001', '10110', '01001', '11010'] },
    { id: 46, left: 73, animationDelay: 3.7, animationDuration: 8, characters: ['enter', 'matrix', 'realm', 'digital', 'world'] },
    { id: 47, left: 83, animationDelay: 5.7, animationDuration: 8, characters: ['01111', '10000', '10111', '01000', '11011'] },
    { id: 48, left: 93, animationDelay: 7.7, animationDuration: 8, characters: ['cyber', 'space', 'grid', 'core', 'link'] },
    { id: 49, left: 7, animationDelay: 0.1, animationDuration: 8, characters: ['11100', '00011', '10100', '01011', '11000'] },
    { id: 50, left: 17, animationDelay: 2.1, animationDuration: 8, characters: ['neural', 'net', 'ai', 'bot', 'cpu'] }
];

export default function Hero() {
  return (
    <div className="relative text-center space-y-8 py-16">
      {/* Matrix digital rain effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {matrixElements.map((element) => (
          <div
            key={element.id}
            className="matrix-element text-green-400 font-mono"
            style={{
              left: `${element.left}%`,
              animationDelay: `${element.animationDelay}s`,
              animationDuration: `${element.animationDuration}s`,
            }}
          >
            {element.characters.map((char, j) => (
              <div key={j} className="mb-1 leading-tight">
                {char}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="relative z-10">
        <div className="mb-6">
          <div className="text-sm text-green-400 font-mono mb-2 tracking-widest">
            [ SYSTEM INITIALIZED ]
          </div>
          <h1 className="text-6xl md:text-8xl font-bold pump-gradient-text mb-4 tracking-wider">
            MATRIX
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-cyan-400 mb-6 tracking-wide">
            REWARDS
          </h2>
        </div>
        <p className="text-xl md:text-2xl text-green-300 max-w-4xl mx-auto leading-relaxed font-mono">
          <span className="text-cyan-400">[ ENTER THE MATRIX ]</span><br/>
          Advanced algorithms distribute creator fees to token holders.<br/>
          <span className="text-lime-400">[ AUTOMATED REWARD SYSTEM ACTIVE ]</span>
        </p>
      </div>
      
      <div className="flex justify-center mt-12 relative z-10">
        <div className="pump-card rounded-lg p-6 max-w-lg w-full">
          <div className="text-center">
            <div className="text-green-400 font-mono text-sm mb-3 tracking-wider">
              [ TOKEN CONTRACT ]
            </div>
            <ContractAddress />
          </div>
        </div>
      </div>
      
    </div>
  );
}
