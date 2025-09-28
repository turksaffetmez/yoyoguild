"use client";
import { useEffect } from 'react';

export default function FarcasterMiniApp() {
  useEffect(() => {
    // Farcaster Mini App environment detection
    const isFarcasterMiniApp = 
      window.self !== window.top ||
      /Farcaster|Warpcast/i.test(navigator.userAgent) ||
      new URLSearchParams(window.location.search).get('farcaster') === 'true' ||
      new URLSearchParams(window.location.search).get('source') === 'farcaster';

    if (isFarcasterMiniApp) {
      console.log('🚀 Farcaster Mini App environment detected');
      
      // Add specific Mini App styling
      document.body.classList.add('farcaster-mini-app');
      
      // Initialize Farcaster SDK if available
      if (window.farcaster) {
        window.farcaster.ready();
        console.log('Farcaster SDK initialized');
      }
      
      // Send ready message to parent window
      if (window.self !== window.top) {
        window.parent.postMessage({ 
          type: 'MINI_APP_READY',
          version: '1.0',
          name: 'YoYo Guild Battle'
        }, '*');
      }
    }
  }, []);

  return null;
}