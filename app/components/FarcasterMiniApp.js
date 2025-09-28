"use client";
import { useEffect } from 'react';

export default function FarcasterMiniApp() {
  useEffect(() => {
    // Farcaster Mini App environment detection
    const isFarcasterMiniApp = 
      window.self !== window.top ||
      /Farcaster|Warpcast/i.test(navigator.userAgent) ||
      new URLSearchParams(window.location.search).get('source') === 'farcaster';

    if (isFarcasterMiniApp) {
      console.log('🎯 Farcaster Mini App environment detected');
      
      // Add specific Mini App styling
      document.body.classList.add('farcaster-mini-app');
      
      // Viewport optimization for embedded mode
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }
  }, []);

  return null;
}