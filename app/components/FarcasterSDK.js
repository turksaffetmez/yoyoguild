"use client";
import { useEffect } from 'react';

export default function FarcasterSDK() {
  useEffect(() => {
    console.log('🎯 FarcasterSDK Component - Double checking ready...');
    
    // Double check ready çağrısı
    const doubleCheckReady = () => {
      try {
        // YENİ SDK - sdk.actions.ready()
        if (window.farcaster?.actions?.ready) {
          window.farcaster.actions.ready();
          console.log('✅ Double check: sdk.actions.ready() called');
          return true;
        }
        // ESKİ SDK - farcaster.ready()
        else if (window.farcaster?.ready) {
          window.farcaster.ready();
          console.log('✅ Double check: farcaster.ready() called');
          return true;
        }
        // SDK BULUNAMADI
        else {
          console.log('🔍 No Farcaster SDK found in component (double check)');
          return false;
        }
      } catch (error) {
        console.error('❌ Double check error:', error);
        return false;
      }
    };

    // Ready mesajı gönder
    const sendReadyMessage = () => {
      if (window.parent !== window) {
        window.parent.postMessage({ 
          type: 'ready', 
          version: '1.0.0',
          app: 'YoYo Guild Battle',
          component: true,
          timestamp: Date.now()
        }, '*');
        console.log('📨 Component ready message sent');
      }
    };

    // Hemen double check yap
    const sdkCalled = doubleCheckReady();
    sendReadyMessage();

    // 2 saniye sonra tekrar dene (SDK yüklenmiş olabilir)
    setTimeout(() => {
      console.log('🔄 Component re-checking SDK...');
      doubleCheckReady();
    }, 2000);

    // 5 saniye sonra final check
    setTimeout(() => {
      console.log('🔍 Component final SDK check...');
      const finalCheck = doubleCheckReady();
      if (!finalCheck) {
        console.warn('⚠️ Component: Farcaster SDK never appeared');
      }
    }, 5000);
    
  }, []);
  
  return null;
}