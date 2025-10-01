"use client";
import { useState, useEffect } from 'react';

const FarcasterWallet = ({ onConnect }) => {
  const [isFarcaster, setIsFarcaster] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [autoConnecting, setAutoConnecting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkFarcaster = () => {
      // Geliştirilmiş Farcaster environment detection
      const isWarpcast = 
        navigator.userAgent.includes('Warpcast') ||
        navigator.userAgent.includes('Farcaster') ||
        window.location.href.includes('warpcast') ||
        document.referrer?.includes('warpcast') ||
        window.self !== window.top;
      
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      setIsFarcaster(isWarpcast);
      setIsMobile(isMobileDevice);
      
      console.log('🔍 Farcaster Detection:', {
        isWarpcast,
        isMobile: isMobileDevice,
        userAgent: navigator.userAgent,
        parent: window.self !== window.top
      });
    };

    checkFarcaster();
  }, [isClient]);

  // Otomatik Farcaster bağlantısı
  useEffect(() => {
    if (!isClient || !isFarcaster || autoConnecting) return;

    const autoConnectFarcaster = async () => {
      setAutoConnecting(true);
      console.log('🎯 Attempting auto-connect in Farcaster environment...');
      
      try {
        // Method 1: Farcaster Mini App SDK
        if (window.farcaster?.actions?.connectWallet) {
          try {
            const accounts = await window.farcaster.actions.connectWallet();
            console.log('✅ Farcaster SDK auto-connect success:', accounts);
            if (accounts && accounts[0] && onConnect) {
              onConnect('farcaster', accounts[0]);
              return;
            }
          } catch (sdkError) {
            console.log('Farcaster SDK auto-connect failed:', sdkError);
          }
        }
        
        // Method 2: EIP-6963 Provider
        if (window.ethereum) {
          try {
            const accounts = await window.ethereum.request({
              method: 'eth_requestAccounts'
            });
            console.log('✅ EIP-6963 auto-connect success:', accounts);
            if (accounts && accounts[0] && onConnect) {
              onConnect('embedded', accounts[0]);
              return;
            }
          } catch (eipError) {
            console.log('EIP-6963 auto-connect failed:', eipError);
          }
        }
        
        console.log('⚠️ Auto-connect not available, showing manual button');
      } catch (error) {
        console.error('❌ Auto-connect error:', error);
      } finally {
        setAutoConnecting(false);
      }
    };

    // 1 saniye sonra otomatik bağlanmayı dene
    const timer = setTimeout(autoConnectFarcaster, 1000);
    
    return () => clearTimeout(timer);
  }, [isClient, isFarcaster, onConnect, autoConnecting]);

  // Farcaster embedded wallet bağlantısı (manuel)
  const connectFarcasterWallet = async () => {
    if (!isClient) return;
    
    try {
      console.log('🎯 Manually connecting to Farcaster wallet...');
      
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
      
      // Method 2: EIP-6963 Provider Discovery
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          console.log('✅ EIP-6963 connect success:', accounts);
          if (accounts && accounts[0] && onConnect) {
            onConnect('embedded', accounts[0]);
            return;
          }
        } catch (eipError) {
          console.log('EIP-6963 connect failed:', eipError);
        }
      }
      
      // Method 3: Direct ethereum request
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          console.log('✅ Direct ethereum connect success:', accounts);
          if (accounts && accounts[0] && onConnect) {
            onConnect('ethereum', accounts[0]);
            return;
          }
        } catch (directError) {
          console.log('Direct ethereum connect failed:', directError);
        }
      }
      
      console.error('❌ All connection methods failed');
      alert('Cannot connect to wallet in Farcaster app. Please try using a browser with MetaMask.');
      
    } catch (error) {
      console.error('Farcaster connect error:', error);
      alert('Connection failed: ' + (error.message || 'Unknown error'));
    }
  };

  if (!isClient || !isFarcaster) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-4 mb-4 border border-purple-500/30">
      <div className="text-center">
        <h3 className="text-white font-bold mb-2">
          {isMobile ? "📱 Farcaster Wallet" : "🎯 Farcaster Detected"}
        </h3>
        
        {/* Basitleştirilmiş UI - Debug bilgileri kaldırıldı */}
        {autoConnecting ? (
          <div className="bg-blue-500/20 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="text-blue-300 text-sm">Auto-connecting...</span>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={connectFarcasterWallet}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold w-full mb-2"
            >
              {isMobile ? "Connect Farcaster Wallet" : "Connect Wallet"}
            </button>
            
            <p className="text-gray-300 text-xs">
              {isMobile 
                ? "Use Farcaster's built-in wallet" 
                : "Connect using Farcaster environment"
              }
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FarcasterWallet;