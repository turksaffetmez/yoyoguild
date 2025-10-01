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

  const connectFarcasterWallet = async () => {
    if (!isClient) return;
    
    try {
      console.log('🎯 Connecting to Farcaster wallet...');
      
      // Method 1: Farcaster Mini App SDK
      if (window.farcaster?.actions?.connectWallet) {
        try {
          const accounts = await window.farcaster.actions.connectWallet();
          console.log('✅ Farcaster SDK connect success:', accounts);
          if (accounts && accounts[0] && onConnect) {
            onConnect('farcaster', accounts[0]);
            return;
          }
        } catch (sdkError) {
          console.log('Farcaster SDK connect failed:', sdkError);
        }
      }
      
      // Method 2: Direct ethereum request
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          console.log('✅ Ethereum connect success:', accounts);
          if (accounts && accounts[0] && onConnect) {
            onConnect('ethereum', accounts[0]);
            return;
          }
        } catch (directError) {
          console.log('Direct ethereum connect failed:', directError);
        }
      }
      
      console.error('❌ All connection methods failed');
      alert('Cannot connect to wallet. Please try again or use a browser with MetaMask.');
      
    } catch (error) {
      console.error('Farcaster connect error:', error);
      alert('Connection failed: ' + (error.message || 'Unknown error'));
    }
  };

  if (!isClient || !isFarcaster) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-4 mb-4 border border-purple-500/30">
      <div className="text-center">
        <button
          onClick={connectFarcasterWallet}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold w-full mb-2"
        >
          Connect Farcaster Wallet
        </button>
        
        <p className="text-gray-300 text-xs">
          Use Farcaster's built-in wallet
        </p>
      </div>
    </div>
  );
};

export default FarcasterWallet;