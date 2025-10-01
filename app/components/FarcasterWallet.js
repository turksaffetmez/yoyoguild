"use client";
import { useState, useEffect } from 'react';

const FarcasterWallet = ({ onConnect }) => {
  const [isFarcaster, setIsFarcaster] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkFarcaster = () => {
      // Farcaster environment detection
      const isWarpcast = 
        navigator.userAgent.includes('Warpcast') ||
        window.location.href.includes('warpcast') ||
        document.referrer?.includes('warpcast') ||
        window.parent !== window;
      
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      setIsFarcaster(isWarpcast);
      setIsMobile(isMobileDevice);
      
      // Debug information
      setDebugInfo({
        isWarpcast,
        isMobile: isMobileDevice,
        userAgent: navigator.userAgent,
        hasParent: window.parent !== window,
        farcaster: !!window.farcaster,
        ethereum: !!window.ethereum,
        farcasterProvider: !!window.farcasterProvider
      });
      
      console.log('🔍 Farcaster Detection:', {
        isWarpcast,
        isMobile: isMobileDevice,
        userAgent: navigator.userAgent,
        parent: window.parent !== window
      });
    };

    checkFarcaster();
  }, [isClient]);

  // Farcaster embedded wallet bağlantısı
  const connectFarcasterWallet = async () => {
    if (!isClient) return;
    
    try {
      console.log('🎯 Connecting to Farcaster embedded wallet...');
      
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
      
      // Method 3: Direct ethereum request (fallback)
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
      
      // Method 4: Farcaster specific provider
      if (window.farcasterProvider) {
        try {
          const accounts = await window.farcasterProvider.request({
            method: 'eth_requestAccounts'
          });
          console.log('✅ Farcaster provider connect success:', accounts);
          if (accounts && accounts[0] && onConnect) {
            onConnect('farcaster_provider', accounts[0]);
            return;
          }
        } catch (fcError) {
          console.log('Farcaster provider connect failed:', fcError);
        }
      }
      
      // Method 5: Check for multiple providers
      if (window.ethereum?.providers) {
        for (let provider of window.ethereum.providers) {
          try {
            const accounts = await provider.request({
              method: 'eth_requestAccounts'
            });
            console.log('✅ Multi-provider connect success:', accounts);
            if (accounts && accounts[0] && onConnect) {
              onConnect('multi_provider', accounts[0]);
              return;
            }
          } catch (multiError) {
            console.log('Multi-provider connect failed:', multiError);
          }
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
        
        {/* Debug Info */}
        <div className="bg-black/20 rounded-lg p-3 mb-3 text-xs">
          <div className="text-gray-300 space-y-1 text-left">
            <div className="flex justify-between">
              <span>Farcaster SDK:</span>
              <span>{debugInfo.farcaster ? '✅ Available' : '❌ Not found'}</span>
            </div>
            <div className="flex justify-between">
              <span>Ethereum Provider:</span>
              <span>{debugInfo.ethereum ? '✅ Available' : '❌ Not found'}</span>
            </div>
            <div className="flex justify-between">
              <span>Mobile Device:</span>
              <span>{debugInfo.isMobile ? '✅ Yes' : '❌ No'}</span>
            </div>
            <div className="flex justify-between">
              <span>Embedded:</span>
              <span>{debugInfo.hasParent ? '✅ Yes' : '❌ No'}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={connectFarcasterWallet}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold w-full mb-2"
        >
          {isMobile ? "Connect Farcaster Wallet" : "Connect in Farcaster"}
        </button>
        
        <p className="text-gray-300 text-xs mt-1">
          {isMobile 
            ? "Use Farcaster's built-in wallet" 
            : "Connect using Farcaster environment"
          }
        </p>
        
        {/* Manual Address Input for Testing */}
        {debugInfo.farcaster && !debugInfo.ethereum && (
          <div className="mt-3 p-2 bg-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-xs mb-1">
              ⚠️ No wallet provider detected
            </p>
            <button
              onClick={() => {
                const testAddress = prompt('Enter test address for debugging:');
                if (testAddress && onConnect) {
                  onConnect('debug', testAddress);
                }
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
            >
              Debug: Manual Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarcasterWallet;