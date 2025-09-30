"use client";
import { useEffect } from 'react';

export default function FarcasterSDK() {
  useEffect(() => {
    console.log('🚀 FarcasterSDK initializing...');
    
    const isFarcaster = window.self !== window.self || 
                       /farcaster|warpcast/i.test(navigator.userAgent) ||
                       window.location.href.includes('farcaster.xyz');

    if (isFarcaster) {
      console.log('🎯 Farcaster environment confirmed');
      
      // FARCaster SPECIFIC ready
      const sendFarcasterReady = () => {
        // Method 1: Standard Farcaster ready
        if (window.farcaster?.ready) {
          window.farcaster.ready()
            .then(() => console.log('✅ farcaster.ready() success'))
            .catch(e => console.log('⚠️ farcaster.ready() failed:', e));
        }
        
        // Method 2: PostMessage with Farcaster format
        const farcasterMsg = {
          type: 'ready',
          version: '1.0.0',
          farcaster: true,
          app: 'YoYo Guild Battle'
        };
        window.parent?.postMessage(farcasterMsg, '*');
        console.log('📨 Farcaster ready sent:', farcasterMsg);
      };

      // HEMEN gönder
      sendFarcasterReady();
      
      // Farcaster bazen yavaş yükleniyor
      [100, 300, 600, 1000, 2000, 3000, 5000, 8000].forEach(timeout => {
        setTimeout(sendFarcasterReady, timeout);
      });

      // Emergency: 10 saniye sonra force hide
      setTimeout(() => {
        console.log('🚨 EMERGENCY: Force ready after 10s');
        sendFarcasterReady();
      }, 10000);
    }

  }, []);

  return null;
}