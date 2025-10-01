"use client";
import { useState, useEffect } from 'react';

const FarcasterWallet = ({ onConnect }) => {
  const [isFarcaster, setIsFarcaster] = useState(false);
  const [isBase, setIsBase] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkEnvironment = () => {
      const ua = navigator.userAgent.toLowerCase();
      
      const isWarpcast = 
        ua.includes('warpcast') || 
        ua.includes('farcaster') || 
        window.self !== window.top;
      
      const isBaseApp = ua.includes('base') || window.location.href.includes('base.org');
      
      setIsFarcaster(isWarpcast);
      setIsBase(isBaseApp);
    };

    checkEnvironment();
  }, [isClient]);

  const connectFarcasterWallet = async () => {
    if (!isClient) return;
    
    try {
      console.log('🎯 Connecting to embedded wallet...');
      
      // Önce Farcaster SDK'yı dene
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
      
      // Sonra normal Ethereum provider'ı dene
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          console.log('✅ Ethereum connect success:', accounts);
          if (accounts && accounts[0] && onConnect) {
            onConnect('embedded', accounts[0]);
            return;
          }
        } catch (directError) {
          console.log('Direct ethereum connect failed:', directError);
        }
      }
      
      // Hiçbiri çalışmazsa
      alert('Cannot connect to wallet. Please make sure you have a wallet available in the app.');
      
    } catch (error) {
      console.error('Wallet connect error:', error);
      alert('Connection failed: ' + (error.message || 'Unknown error'));
    }
  };

  // Sadece Farcaster veya Base uygulamalarında göster
  if (!isClient || (!isFarcaster && !isBase)) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-4 mb-4 border border-purple-500/30">
      <div className="text-center">
        <button
          onClick={connectFarcasterWallet}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold w-full mb-2"
        >
          {isFarcaster ? "Connect Farcaster Wallet" : "Connect Base Wallet"}
        </button>
        
        <p className="text-gray-300 text-xs">
          {isFarcaster ? "Use Farcaster's built-in wallet" : "Use Base's embedded wallet"}
        </p>
      </div>
    </div>
  );
};

export default FarcasterWallet;