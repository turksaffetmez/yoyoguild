"use client";
import { useEffect } from 'react';

export default function FarcasterSDK() {
  useEffect(() => {
    console.log('🎯 FarcasterSDK - Checking for SDK...');
    
    const checkAndCallSDK = () => {
      try {
        // YENİ SDK - sdk.actions.ready()
        if (window.farcaster?.actions?.ready) {
          window.farcaster.actions.ready();
          console.log('✅ sdk.actions.ready() called successfully');
          return true;
        }
        // ESKİ SDK - farcaster.ready()
        else if (window.farcaster?.ready) {
          window.farcaster.ready();
          console.log('✅ farcaster.ready() called successfully');
          return true;
        }
        // SDK BULUNAMADI
        else {
          console.log('🔍 Farcaster SDK not found in window object');
          return false;
        }
      } catch (error) {
        console.error('❌ Error calling SDK ready:', error);
        return false;
      }
    };

    // Ready mesajı gönder (SDK olsun ya da olmasın)
    const sendReadyMessage = (sdkCalled) => {
      if (window.parent !== window) {
        window.parent.postMessage({ 
          type: 'ready', 
          version: '1.0.0',
          app: 'YoYo Guild Battle',
          sdkReady: sdkCalled,
          timestamp: Date.now()
        }, '*');
        console.log('📨 Ready message sent, SDK called:', sdkCalled);
      }
    };

    // Hemen dene
    const sdkCalled = checkAndCallSDK();
    sendReadyMessage(sdkCalled);

    // Farcaster SDK'si yavaş yüklenebilir - tekrar dene
    if (!sdkCalled) {
      console.log('⏳ Retrying SDK detection...');
      const retryIntervals = [500, 1000, 2000, 3000, 5000];
      
      retryIntervals.forEach(timeout => {
        setTimeout(() => {
          const retrySuccess = checkAndCallSDK();
          if (retrySuccess) {
            sendReadyMessage(true);
          }
        }, timeout);
      });

      // Final attempt
      setTimeout(() => {
        if (!window.farcaster) {
          console.warn('⚠️ Farcaster SDK never loaded, app will work without SDK');
          sendReadyMessage(false);
        }
      }, 10000);
    }
    
  }, []);
  
  return null;
}