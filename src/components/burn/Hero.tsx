'use client';

import BurnWalletAddress from "./BurnWalletAddress";

// Predefined matrix elements that loop continuously - defined outside component
const matrixElements = [
    { id: 1, left: 5, animationDelay: -2, animationDuration: 10.56, characters: ['010101', '110011', '001100', '101010', '011001'] },
    { id: 2, left: 15, animationDelay: 0, animationDuration: 10.56, characters: ['BURN', 'FIRE', 'ASH', 'SMOKE', 'FLAME'] },
    { id: 3, left: 25, animationDelay: 2, animationDuration: 10.56, characters: ['0110', '1001', '1100', '0011', '1010'] },
    { id: 4, left: 35, animationDelay: 4, animationDuration: 10.56, characters: ['TOKEN', 'COIN', 'BURN', 'FIRE', 'ASH'] },
    { id: 5, left: 45, animationDelay: -1, animationDuration: 10.56, characters: ['1111', '0000', '1010', '0101', '1100'] },
    { id: 6, left: 55, animationDelay: 1, animationDuration: 10.56, characters: ['BURNS', 'FIRE', 'ASH', 'SMOKE', 'FLAME'] },
    { id: 7, left: 65, animationDelay: 3, animationDuration: 10.56, characters: ['01101', '10010', '11001', '00110', '10101'] },
    { id: 8, left: 75, animationDelay: 5, animationDuration: 10.56, characters: ['BURN', 'FIRE', 'ASH', 'SMOKE', 'FLAME'] },
    { id: 9, left: 85, animationDelay: -1.5, animationDuration: 10.56, characters: ['1110', '0001', '1011', '0100', '1101'] },
    { id: 10, left: 95, animationDelay: 0.5, animationDuration: 10.56, characters: ['TOKEN', 'COIN', 'BURN', 'FIRE', 'ASH'] },
    { id: 11, left: 10, animationDelay: 2.5, animationDuration: 10.56, characters: ['0111', '1000', '1011', '0100', '1101'] },
    { id: 12, left: 20, animationDelay: 4.5, animationDuration: 10.56, characters: ['FIRE', 'ASH', 'SMOKE', 'FLAME', 'BURN'] },
    { id: 13, left: 30, animationDelay: -0.5, animationDuration: 10.56, characters: ['11110', '00001', '10110', '01001', '11010'] },
    { id: 14, left: 40, animationDelay: 1.5, animationDuration: 10.56, characters: ['BURN', 'FIRE', 'ASH', 'SMOKE', 'FLAME'] },
    { id: 15, left: 50, animationDelay: 3.5, animationDuration: 10.56, characters: ['01111', '10000', '10111', '01000', '11011'] },
    { id: 16, left: 60, animationDelay: 5.5, animationDuration: 10.56, characters: ['MATRIX', 'BURNS', 'FIRE', 'ASH', 'SMOKE'] },
    { id: 17, left: 70, animationDelay: -1.8, animationDuration: 10.56, characters: ['11100', '00011', '10100', '01011', '11000'] },
    { id: 18, left: 80, animationDelay: 0.2, animationDuration: 10.56, characters: ['FIRE', 'ASH', 'SMOKE', 'FLAME', 'BURN'] },
    { id: 19, left: 90, animationDelay: 2.2, animationDuration: 10.56, characters: ['01100', '10011', '11000', '00111', '10100'] },
    { id: 20, left: 12, animationDelay: 4.2, animationDuration: 10.56, characters: ['BURN', 'FIRE', 'ASH', 'SMOKE', 'FLAME'] },
    { id: 21, left: 22, animationDelay: -0.8, animationDuration: 10.56, characters: ['11101', '00010', '10101', '01010', '11001'] },
    { id: 22, left: 32, animationDelay: 1.2, animationDuration: 10.56, characters: ['BURNS', 'FIRE', 'ASH', 'SMOKE', 'FLAME'] },
    { id: 23, left: 42, animationDelay: 3.2, animationDuration: 10.56, characters: ['01110', '10001', '11010', '00101', '10110'] },
    { id: 24, left: 52, animationDelay: 5.2, animationDuration: 10.56, characters: ['TOKEN', 'COIN', 'BURN', 'FIRE', 'ASH'] },
    { id: 25, left: 62, animationDelay: -1.2, animationDuration: 10.56, characters: ['11111', '00000', '10101', '01010', '11011'] },
    { id: 26, left: 72, animationDelay: 0.8, animationDuration: 10.56, characters: ['FIRE', 'ASH', 'SMOKE', 'FLAME', 'BURN'] },
    { id: 27, left: 82, animationDelay: 2.8, animationDuration: 10.56, characters: ['01101', '10010', '11001', '00110', '10101'] },
    { id: 28, left: 92, animationDelay: 4.8, animationDuration: 10.56, characters: ['BURN', 'FIRE', 'ASH', 'SMOKE', 'FLAME'] },
    { id: 29, left: 8, animationDelay: -0.2, animationDuration: 10.56, characters: ['11110', '00001', '10110', '01001', '11010'] },
    { id: 30, left: 18, animationDelay: 1.8, animationDuration: 10.56, characters: ['FIRE', 'ASH', 'SMOKE', 'FLAME', 'BURN'] },
    { id: 31, left: 28, animationDelay: 3.8, animationDuration: 10.56, characters: ['01111', '10000', '10111', '01000', '11011'] },
    { id: 32, left: 38, animationDelay: 5.8, animationDuration: 10.56, characters: ['BURN', 'FIRE', 'ASH', 'SMOKE', 'FLAME'] },
    { id: 33, left: 48, animationDelay: -1.7, animationDuration: 10.56, characters: ['11100', '00011', '10100', '01011', '11000'] },
    { id: 34, left: 58, animationDelay: 0.3, animationDuration: 10.56, characters: ['FIRE', 'ASH', 'SMOKE', 'FLAME', 'BURN'] },
    { id: 35, left: 68, animationDelay: 2.3, animationDuration: 10.56, characters: ['01100', '10011', '11000', '00111', '10100'] },
    { id: 36, left: 78, animationDelay: 4.3, animationDuration: 10.56, characters: ['BURN', 'FIRE', 'ASH', 'SMOKE', 'FLAME'] },
    { id: 37, left: 88, animationDelay: -0.7, animationDuration: 10.56, characters: ['11101', '00010', '10101', '01010', '11001'] },
    { id: 38, left: 98, animationDelay: 1.3, animationDuration: 10.56, characters: ['BURNS', 'FIRE', 'ASH', 'SMOKE', 'FLAME'] },
    { id: 39, left: 3, animationDelay: 3.3, animationDuration: 10.56, characters: ['01110', '10001', '11010', '00101', '10110'] },
    { id: 40, left: 13, animationDelay: 5.3, animationDuration: 10.56, characters: ['TOKEN', 'COIN', 'BURN', 'FIRE', 'ASH'] },
    { id: 41, left: 23, animationDelay: -1.3, animationDuration: 10.56, characters: ['11111', '00000', '10101', '01010', '11011'] },
    { id: 42, left: 33, animationDelay: 0.7, animationDuration: 10.56, characters: ['FIRE', 'ASH', 'SMOKE', 'FLAME', 'BURN'] },
    { id: 43, left: 43, animationDelay: 2.7, animationDuration: 10.56, characters: ['01101', '10010', '11001', '00110', '10101'] },
    { id: 44, left: 53, animationDelay: 4.7, animationDuration: 10.56, characters: ['BURN', 'FIRE', 'ASH', 'SMOKE', 'FLAME'] },
    { id: 45, left: 63, animationDelay: -0.3, animationDuration: 10.56, characters: ['11110', '00001', '10110', '01001', '11010'] },
    { id: 46, left: 73, animationDelay: 1.7, animationDuration: 10.56, characters: ['FIRE', 'ASH', 'SMOKE', 'FLAME', 'BURN'] },
    { id: 47, left: 83, animationDelay: 3.7, animationDuration: 10.56, characters: ['01111', '10000', '10111', '01000', '11011'] },
    { id: 48, left: 93, animationDelay: 5.7, animationDuration: 10.56, characters: ['BURN', 'FIRE', 'ASH', 'SMOKE', 'FLAME'] },
    { id: 49, left: 7, animationDelay: -1.9, animationDuration: 10.56, characters: ['11100', '00011', '10100', '01011', '11000'] },
    { id: 50, left: 17, animationDelay: 0.1, animationDuration: 10.56, characters: ['FIRE', 'ASH', 'SMOKE', 'FLAME', 'BURN'] }
];

export default function Hero() {
  return (
    <div className="relative text-center space-y-8 py-16">
      {/* Matrix digital rain effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {matrixElements.map((element) => (
          <div
            key={element.id}
            className="matrix-element text-red-400 font-mono"
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
          <h1 className="text-6xl md:text-8xl font-bold text-red-400 mb-4 tracking-wider" style={{textShadow: '0 0 15px rgba(220, 38, 38, 0.6)'}}>
            Burn wallet automatically buys back and burns tokens!
          </h1>
        </div>
          <p className="text-xl md:text-2xl font-semibold text-gray-300 max-w-4xl mx-auto leading-relaxed">
            <span className="text-red-400">More volume, more tokens burned!</span><br/>
            <span className="text-yellow-400">[AUTOMATED BURN ALGORITHM]</span>
          </p>
      </div>
      
      
    </div>
  );
}
