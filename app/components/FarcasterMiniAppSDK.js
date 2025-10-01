"use client";
import { useEffect } from 'react';

// Mini App SDK'yi dynamic import ile yükle
export default function FarcasterMiniAppSDK() {
  useEffect(() => {
    console.log('🎯 Farcaster Mini App SDK Initializing...');
    
    const initializeMiniAppSDK = async () => {
      try {
        // Dynamic import ile Mini App SDK'yı yükle
        const { sdk } = await import('@farcaster/miniapp-sdk');
        console.log('✅ Mini App SDK loaded successfully');
        
        // Ready çağır
        await sdk.actions.ready();
        console.log('✅ sdk.actions.ready() called successfully');
        
        // SDK'yı global'e kaydet (diğer component'ler için)
        window.farcaster = sdk;
        
      } catch (error) {
        console.error('❌ Mini App SDK failed:', error);
        
        // Fallback: Ready mesajı gönder
        if (window.parent !== window) {
          window.parent.postMessage({ 
            type: 'ready', 
            data: { version: '1.0.0' } 
          }, '*');
          console.log('📨 Fallback ready message sent');
        }
      }
    };

    initializeMiniAppSDK();
    
  }, []);
  
  return null;
}