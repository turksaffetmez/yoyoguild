"use client";
import { useEffect } from 'react';

export default function FarcasterSDK() {
  useEffect(() => {
    console.log('🚀 FarcasterSDK initializing...');
    
    // ✅ BASE APP İÇİN KRİTİK - ready() ÇAĞRISI
    const initializeBaseApp = () => {
      if (window.self !== window.top) {
        console.log('🎯 Base App environment detected');
        
        // Hemen ready mesajı gönder
        const sendReady = () => {
          const readyMsg = {
            type: 'ready',
            version: '1.0.0',
            app: 'YoYo Guild Battle'
          };
          
          console.log('📨 Sending ready message...');
          window.parent.postMessage(readyMsg, '*');
          
          // Base App SDK'yı kontrol et
          if (window.farcaster && window.farcaster.ready) {
            window.farcaster.ready()
              .then(() => console.log('✅ farcaster.ready() successful'))
              .catch(err => console.warn('⚠️ farcaster.ready() failed:', err));
          }
        };

        // Hemen gönder
        sendReady();
        
        // 1 saniye sonra tekrar dene
        setTimeout(sendReady, 1000);
        
        // 3 saniye sonra tekrar dene
        setTimeout(sendReady, 3000);
      }
    };

    // HEMEN başlat
    initializeBaseApp();

    // Farcaster SDK yükleme (opsiyonel)
    const loadFarcasterSDK = () => {
      if (window.self !== window.top && !window.farcaster) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@farcaster/auth-kit@latest';
        script.async = true;
        
        script.onload = () => {
          console.log('✅ Farcaster SDK loaded');
          if (window.farcaster && window.farcaster.ready) {
            window.farcaster.ready()
              .then(() => console.log('✅ farcaster.ready() successful after SDK load'))
              .catch(err => console.warn('⚠️ farcaster.ready() failed after SDK load:', err));
          }
        };
        
        document.head.appendChild(script);
      }
    };

    loadFarcasterSDK();

  }, []);

  return null;
}