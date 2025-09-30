"use client";
import { useEffect } from 'react';

export default function FarcasterSDK() {
  useEffect(() => {
    console.log('🚀 FarcasterSDK initializing...');
    
    // ✅ KRİTİK - BASE APP READY ÇÖZÜMÜ
    const initializeMiniApp = async () => {
      // Farcaster Mini App environment kontrolü
      const isMiniApp = window.self !== window.top;
      
      if (isMiniApp) {
        console.log('🎯 Farcaster Mini App detected, sending ready...');
        
        // YÖNTEM 1: Direct ready mesajı
        const sendReadyMessage = () => {
          const readyMsg = {
            type: 'ready',
            version: '1.0.0',
            app: 'YoYo Guild Battle'
          };
          window.parent.postMessage(readyMsg, '*');
          console.log('📨 Ready message sent to parent');
        };

        // YÖNTEM 2: Farcaster SDK kullanımı
        const useFarcasterSDK = async () => {
          try {
            // SDK'yı dynamic import et
            const { createMiniAppSDK } = await import('@farcaster/miniapp-sdk');
            const sdk = createMiniAppSDK();
            await sdk.actions.ready();
            console.log('✅ Farcaster SDK ready() successful');
          } catch (error) {
            console.log('⚠️ Farcaster SDK not available, using fallback');
          }
        };

        // HEMEN çalıştır
        sendReadyMessage();
        
        // Multiple denemeler (splash screen için kritik)
        setTimeout(sendReadyMessage, 100);
        setTimeout(sendReadyMessage, 500);
        setTimeout(sendReadyMessage, 1000);
        setTimeout(sendReadyMessage, 2000);
        
        // SDK'yı dene
        setTimeout(useFarcasterSDK, 300);
        
        // Fallback: 5 saniye sonra hala splash varsa force ready
        setTimeout(() => {
          sendReadyMessage();
          console.log('🔄 Final ready attempt');
        }, 5000);
      }
    };

    initializeMiniApp();

  }, []);

  return null;
}