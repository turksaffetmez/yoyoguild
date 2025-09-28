"use client";
import { useEffect } from 'react';

export default function FarcasterSDK() {
  useEffect(() => {
    console.log('🚀 FarcasterSDK initializing...');
    
    // IMMEDIATE READY CALL - Base App 5 saniye bekliyor!
    const sendImmediateReady = () => {
      if (window.parent !== window) {
        const readyMsg = {
          type: 'ready',
          version: '1.0.0',
          app: 'YoYo Guild Battle',
          timestamp: Date.now()
        };
        
        console.log('📨 IMMEDIATE ready message sent');
        window.parent.postMessage(readyMsg, '*');
        
        // 1 saniye sonra tekrar gönder
        setTimeout(() => {
          window.parent.postMessage(readyMsg, '*');
          console.log('📨 Second ready message sent');
        }, 1000);
        
        // 3 saniye sonra tekrar gönder
        setTimeout(() => {
          window.parent.postMessage(readyMsg, '*');
          console.log('📨 Third ready message sent');
        }, 3000);
      }
    };

    // HEMEN gönder - SDK beklemeyin!
    sendImmediateReady();

    // Farcaster detection
    const isFarcasterMiniApp = 
      window.self !== window.top ||
      /Farcaster|Warpcast/i.test(navigator.userAgent) ||
      new URLSearchParams(window.location.search).get('source') === 'farcaster' ||
      document.referrer.includes('farcaster') ||
      document.referrer.includes('warpcast') ||
      window.location.href.includes('base.org');

    if (isFarcasterMiniApp) {
      console.log('🎯 Farcaster Mini App environment detected');
      
      // SDK'yı yükle (ama ready için beklemeyin)
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@farcaster/auth-kit@latest';
      script.async = true;
      
      script.onload = () => {
        console.log('✅ Farcaster SDK loaded');
        // SDK yüklendikten sonra da ready çağır
        if (window.farcaster && window.farcaster.ready) {
          window.farcaster.ready()
            .then(() => console.log('✅ farcaster.ready() successful'))
            .catch(err => console.warn('⚠️ farcaster.ready() failed:', err));
        }
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load Farcaster SDK');
      };
      
      document.head.appendChild(script);
    }

  }, []);

  return null;
}