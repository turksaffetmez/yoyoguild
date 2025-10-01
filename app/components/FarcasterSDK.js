"use client";
import { useEffect } from 'react';

export default function FarcasterSDK() {
  useEffect(() => {
    console.log('🎯 FarcasterSDK Initializing...');
    
    // SDK yüklendikten sonra ready çağır
    const waitForSDK = () => {
      // SDK kontrolü
      if (window.farcaster && window.farcaster.actions) {
        console.log('✅ Farcaster SDK loaded, calling sdk.actions.ready()');
        window.farcaster.actions.ready();
        return true;
      }
      // Eski SDK
      else if (window.farcaster && window.farcaster.ready) {
        console.log('✅ Farcaster SDK (old) loaded, calling farcaster.ready()');
        window.farcaster.ready();
        return true;
      }
      // SDK yok
      else {
        console.log('❌ Farcaster SDK not found');
        return false;
      }
    };

    // Ready mesajı (her zaman gönder)
    const sendReadyMessage = () => {
      if (window.parent !== window) {
        window.parent.postMessage({ 
          type: 'ready', 
          version: '1.0.0',
          app: 'YoYo Guild Battle',
          sdkAvailable: !!window.farcaster
        }, '*');
        console.log('📨 Ready message sent, SDK available:', !!window.farcaster);
      }
    };

    // Hemen dene
    let sdkLoaded = waitForSDK();
    sendReadyMessage();

    // SDK yüklenmesi için bekleyelim
    if (!sdkLoaded) {
      console.log('⏳ Waiting for Farcaster SDK to load...');
      
      const attempts = [100, 500, 1000, 2000, 5000];
      attempts.forEach(timeout => {
        setTimeout(() => {
          sdkLoaded = waitForSDK() || sdkLoaded;
          sendReadyMessage();
        }, timeout);
      });

      // Final attempt
      setTimeout(() => {
        if (!sdkLoaded) {
          console.warn('⚠️ Farcaster SDK still not loaded after 10 seconds');
          sendReadyMessage();
        }
      }, 10000);
    }
    
  }, []);
  
  return null;
}