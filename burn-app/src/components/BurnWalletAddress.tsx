'use client';

import { useState, useEffect } from 'react';

export default function BurnWalletAddress() {
  const [burnWalletAddress, setBurnWalletAddress] = useState('Loading...');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadBurnWalletAddress = async () => {
      try {
        const response = await fetch('/api/burn-wallet');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.burnWalletAddress) {
            setBurnWalletAddress(data.data.burnWalletAddress);
          } else {
            setBurnWalletAddress('BURN_WALLET_ADDRESS_NOT_SET');
          }
        } else {
          setBurnWalletAddress('BURN_WALLET_ADDRESS_NOT_SET');
        }
      } catch (error) {
        setBurnWalletAddress('BURN_WALLET_ADDRESS_NOT_SET');
      }
    };

    loadBurnWalletAddress();
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(burnWalletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  return (
    <div className="text-center">
      <div className="text-sm font-semibold text-gray-300 mb-2 tracking-wide">
        [ BURN WALLET ]
      </div>
      <div className="flex items-center justify-center space-x-2">
        <span className="font-mono text-sm text-red-400 break-all">
          {burnWalletAddress}
        </span>
        <button
          onClick={copyToClipboard}
          className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
        >
          {copied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-red-400"
            >
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
          )}
        </button>
      </div>
      <div className="text-gray-400 font-mono text-xs mt-1">
        This wallet buys and burns tokens
      </div>
    </div>
  );
}
