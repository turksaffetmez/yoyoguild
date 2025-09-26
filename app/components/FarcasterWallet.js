"use client";
import { useState, useEffect } from 'react';

const FarcasterWallet = ({ onConnect }) => {
  const [isFarcaster, setIsFarcaster] = useState(false);

  useEffect(() => {
    const checkFarcaster = () => {
      const isFarcasterEnv = 
        window.ethereum?.isFarcaster || 
        navigator.userAgent.includes('Farcaster') ||
        window.location.href.includes('warpcast') ||
        document.referrer.includes('farcaster');
      
      setIsFarcaster(isFarcasterEnv);
    };

    checkFarcaster();
  }, []);

  const connectFarcaster = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        if (onConnect) onConnect(accounts[0], 'farcaster');
      }
    } catch (error) {
      console.error('Farcaster connect error:', error);
    }
  };

  if (!isFarcaster) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-4 mb-4 border border-purple-500/30">
      <div className="text-center">
        <h3 className="text-white font-bold mb-2">🎯 Farcaster Mini App Detected</h3>
        <p className="text-gray-300 text-sm mb-3">Enhanced experience for Farcaster users</p>
        <button
          onClick={connectFarcaster}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold"
        >
          Connect Farcaster Wallet
        </button>
      </div>
    </div>
  );
};

export default FarcasterWallet;