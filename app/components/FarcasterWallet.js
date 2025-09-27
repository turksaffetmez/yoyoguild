"use client";
import { useState, useEffect } from 'react';

const FarcasterWallet = ({ onConnect }) => {
  const [isFarcaster, setIsFarcaster] = useState(false);
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkFarcaster = () => {
      const isWarpcast = 
        window.ethereum?.isFarcaster ||
        navigator.userAgent.includes('Warpcast') ||
        window.location.href.includes('warpcast') ||
        document.referrer.includes('warpcast') ||
        window.parent !== window;
      
      setIsFarcaster(isWarpcast);
      setIsMiniApp(window.parent !== window);
    };

    checkFarcaster();
  }, [isClient]);

  const connectFarcaster = async () => {
    if (!isClient) return;
    
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

  if (!isClient || !isFarcaster) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-4 mb-4 border border-purple-500/30">
      <div className="text-center">
        <h3 className="text-white font-bold mb-2">
          {isMiniApp ? "🎯 Playing in Warpcast" : "🎯 Farcaster Detected"}
        </h3>
        <button
          onClick={connectFarcaster}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold"
        >
          {isMiniApp ? "🎮 Start Battle" : "Connect Farcaster Wallet"}
        </button>
      </div>
    </div>
  );
};

export default FarcasterWallet;