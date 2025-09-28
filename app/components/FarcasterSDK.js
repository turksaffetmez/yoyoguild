"use client";
import { useEffect } from 'react';

export default function FarcasterSDK() {
  useEffect(() => {
    // Farcaster Mini App environment detection
    const isFarcasterMiniApp = 
      window.self !== window.top ||
      /Farcaster|Warpcast/i.test(navigator.userAgent) ||
      new URLSearchParams(window.location.search).get('source') === 'farcaster' ||
      document.referrer.includes('farcaster') ||
      document.referrer.includes('warpcast');

    if (isFarcasterMiniApp) {
      console.log('🚀 Farcaster Mini App detected, loading SDK...');
      
      // Farcaster SDK scriptini yükle
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@farcaster/auth-kit@latest';
      script.onload = () => {
        console.log('✅ Farcaster SDK loaded successfully');
        
        // SDK yüklendikten sonra ready() çağır - CRITICAL
        if (window.farcaster) {
          window.farcaster.ready()
            .then(() => {
              console.log('✅ Farcaster SDK ready() called successfully');
              // Additional success actions if needed
            })
            .catch((error) => {
              console.error('❌ Farcaster SDK ready() failed:', error);
              // Fallback: Manual ready call
              sendManualReady();
            });
        } else {
          console.warn('⚠️ Farcaster SDK not available, using fallback');
          // Fallback if SDK not available
          sendManualReady();
        }
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load Farcaster SDK');
        // Fallback for embedded mode
        sendManualReady();
      };
      
      document.head.appendChild(script);
    }

    // Fallback ready function for embedded mode
    function sendManualReady() {
      if (window.parent !== window) {
        console.log('📨 Sending manual ready message to parent...');
        const readyMessage = { 
          type: 'ready',
          version: '1.0.0',
          timestamp: Date.now(),
          data: { 
            app: 'YoYo Guild Battle',
            loaded: true 
          }
        };
        
        // Hemen gönder
        window.parent.postMessage(readyMessage, '*');
        
        // 1 saniye sonra tekrar gönder (garanti olsun)
        setTimeout(() => {
          window.parent.postMessage(readyMessage, '*');
          console.log('📨 Sent second ready message (fallback)');
        }, 1000);
        
        // 3 saniye sonra tekrar gönder
        setTimeout(() => {
          window.parent.postMessage(readyMessage, '*');
          console.log('📨 Sent third ready message (fallback)');
        }, 3000);
      }
    }

    // Direct embedded mode detection - immediate ready call
    if (window.self !== window.top) {
      console.log('🔍 Embedded mode detected, sending immediate ready...');
      setTimeout(sendManualReady, 500);
    }

  }, []);

  return null;
}