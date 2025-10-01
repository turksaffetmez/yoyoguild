"use client";
import { useState, useEffect } from 'react';

const FarcasterWallet = ({ onConnect }) => {
  const [isFarcaster, setIsFarcaster] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkFarcaster = () => {
      const isWarpcast = 
        navigator.userAgent.includes('Warpcast') ||
        navigator.userAgent.includes('Farcaster') ||
        window.location.href.includes('warpcast') ||
        document.referrer?.includes('warpcast') ||
        window.self !== window.top;
      
      setIsFarcaster(isWarpcast);
    };

    checkFarcaster();
  }, [isClient]);

  const showMaintenanceMessage = () => {
    alert("Wallet connection is under maintenance. It will be available soon.");
  };

  if (!isClient || !isFarcaster) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-4 mb-4 border border-purple-500/30">
      <div className="text-center">
        <button
          onClick={showMaintenanceMessage}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold w-full mb-2"
        >
          Connect Farcaster Wallet
        </button>
        
        <p className="text-gray-300 text-xs">
          ⚠️ Wallet connection under maintenance
        </p>
      </div>
    </div>
  );
};

export default FarcasterWallet;