"use client";
import { useState, useEffect } from 'react';

const FarcasterWallet = ({ onConnect }) => {
  const [isFarcaster, setIsFarcaster] = useState(false);
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    const checkFarcaster = () => {
      // Warpcast Mini App detection
      const isWarpcast = 
        window.ethereum?.isFarcaster ||
        navigator.userAgent.includes('Warpcast') ||
        window.location.href.includes('warpcast') ||
        document.referrer.includes('warpcast') ||
        window.parent !== window; // Iframe check for Mini Apps
      
      setIsFarcaster(isWarpcast);
      setIsMiniApp(window.parent !== window);
      
      console.log('Farcaster environment detected:', isWarpcast);
      console.log('Mini App mode:', window.parent !== window);
    };

    checkFarcaster();
    
    // Farcaster specific styling
    if (window.parent !== window) {
      document.body.style.background = 'linear-gradient(135deg, #1E293B 0%, #334155 100%)';
    }
  }, []);

  const connectFarcaster = async () => {
    try {
      if (window.ethereum) {
        console.log('Connecting Farcaster wallet...');
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        if (onConnect) onConnect(accounts[0], 'farcaster');
        
        // Mini App'te oyunu başlat
        if (window.parent !== window) {
          window.parent.postMessage({ type: 'START_GAME' }, '*');
        }
      } else {
        console.log('No ethereum provider found');
      }
    } catch (error) {
      console.error('Farcaster connect error:', error);
    }
  };

  if (!isFarcaster) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-4 mb-4 border border-purple-500/30">
      <div className="text-center">
        <h3 className="text-white font-bold mb-2">
          {isMiniApp ? "🎯 Playing in Warpcast" : "🎯 Farcaster Detected"}
        </h3>
        <p className="text-gray-300 text-sm mb-3">
          {isMiniApp 
            ? "Optimized experience for Mini App" 
            : "Enhanced Farcaster wallet support"
          }
        </p>
        <button
          onClick={connectFarcaster}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold"
        >
          {isMiniApp ? "🎮 Start Battle" : "Connect Farcaster Wallet"}
        </button>
        
        {isMiniApp && (
          <p className="text-green-400 text-xs mt-2">
            ✅ Mini App mode active
          </p>
        )}
      </div>
    </div>
  );
};

export default FarcasterWallet;