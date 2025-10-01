"use client";
import { useEffect } from 'react';

export default function FarcasterSDK() {
  useEffect(() => {
    console.log('🎯 FarcasterSDK Initializing...');
    
    const initializeFarcaster = () => {
      try {
        // YENİ SDK FORMATI - sdk.actions.ready()
        if (window.farcaster && window.farcaster.actions) {
          window.farcaster.actions.ready();
          console.log('✅ sdk.actions.ready() called');
        }
        // ESKİ SDK FORMATI (fallback)
        else if (typeof farcaster !== 'undefined') {
          farcaster.ready();
          console.log('✅ farcaster.ready() called (fallback)');
        }
        
        // READY MESAJI (Mini App'ler için)
        if (window.parent !== window) {
          window.parent.postMessage({ 
            type: 'ready', 
            version: '1.0.0',
            app: 'YoYo Guild Battle'
          }, '*');
          console.log('📨 Ready message sent to parent');
        }
      } catch (error) {
        console.error('Farcaster SDK error:', error);
      }
    };

    // Hemen çağır + multiple attempts
    initializeFarcaster();
    [100, 500, 1000, 2000, 5000].forEach(timeout => {
      setTimeout(initializeFarcaster, timeout);
    });
    
  }, []);
  
  return null;
}