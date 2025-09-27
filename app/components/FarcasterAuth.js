"use client";
import { useState, useEffect } from 'react';

const FarcasterAuth = ({ onAuth }) => {
  const [isFarcaster, setIsFarcaster] = useState(false);

  useEffect(() => {
    // Farcaster environment detection
    const isEmbedded = window.self !== window.top;
    const isFarcasterUA = /Farcaster|Warpcast/i.test(navigator.userAgent);
    setIsFarcaster(isEmbedded || isFarcasterUA);
  }, []);

  const connectFarcaster = async () => {
    if (window.ethereum && window.ethereum.isFarcaster) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        onAuth(accounts[0], 'farcaster');
      } catch (error) {
        console.error('Farcaster auth failed:', error);
      }
    }
  };

  if (!isFarcaster) return null;

  return (
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
      <div className="text-center">
        <h3 className="text-blue-400 font-bold mb-2">🎯 Playing in Farcaster</h3>
        <button
          onClick={connectFarcaster}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Connect Farcaster Wallet
        </button>
      </div>
    </div>
  );
};

export default FarcasterAuth;