"use client";

import { useState } from "react";

export default function ContractAddress() {
  const [copied, setCopied] = useState(false);
  const address = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || 'Address not configured';

  const copyToClipboard = async () => {
    try {
      const contractAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
      if (!contractAddress) {
        console.error("NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS not found in environment variables");
        return;
      }
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-gray-300 uppercase tracking-wide">
          CONTRACT ADDRESS
        </span>
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-2 text-left hover:text-green-300 transition-colors cursor-pointer"
        >
          <span className="font-mono text-sm text-green-400">{address}</span>
          {copied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-green-400"
            >
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-green-400"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
