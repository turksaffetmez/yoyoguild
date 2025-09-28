"use client";
import { useEffect } from 'react';

export default function FarcasterSDK() {
  useEffect(() => {
    // Farcaster Mini App environment detection
    const isFarcasterMiniApp = 
      window.self !== window.top ||
      /Farcaster|Warpcast/i.test(navigator.userAgent) ||
      new URLSearchParams(window.location.search).get('source') === 'farcaster';

    if (isFarcasterMiniApp) {
      console.log('🚀 Farcaster Mini App detected, loading SDK...');
      
      // Farcaster SDK scriptini yükle
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@farcaster/auth-kit@latest';
      script.onload = () => {
        console.log('Farcaster SDK loaded');
        
        // SDK yüklendikten sonra ready() çağır
        if (window.farcaster) {
          window.farcaster.ready()
            .then(() => {
              console.log('✅ Farcaster SDK ready() called successfully');
              // Splash screen kalkacak
            })
            .catch((error) => {
              console.error('❌ Farcaster SDK ready() failed:', error);
            });
        }
      };
      
      script.onerror = () => {
        console.error('Failed to load Farcaster SDK');
        // Fallback: Manual ready call for embedded mode
        if (window.parent !== window) {
          window.parent.postMessage({ type: 'ready' }, '*');
        }
      };
      
      document.head.appendChild(script);
    }

    // Fallback for embedded mode
    if (window.self !== window.top) {
      // Embedded modda manual ready mesajı gönder
      setTimeout(() => {
        window.parent.postMessage({ 
          type: 'ready',
          version: '1.0.0'
        }, '*');
        console.log('📨 Sent manual ready message to parent');
      }, 1000);
    }

  }, []);

  return null;
}