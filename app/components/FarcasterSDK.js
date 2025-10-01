"use client";
import { useEffect } from 'react';

export default function FarcasterSDK() {
  useEffect(() => {
    console.log('🎯 FarcasterSDK Component - Final ready checks...');
    
    const performFinalReadyChecks = () => {
      try {
        let sdkCalled = false;
        
        // 1. YENİ SDK - sdk.actions.ready()
        if (window.farcaster?.actions?.ready) {
          window.farcaster.actions.ready();
          console.log('✅ Component: sdk.actions.ready() called');
          sdkCalled = true;
        }
        // 2. ESKİ SDK - farcaster.ready()
        else if (window.farcaster?.ready) {
          window.farcaster.ready();
          console.log('✅ Component: farcaster.ready() called');
          sdkCalled = true;
        }
        // 3. GLOBAL FARCASTER
        else if (typeof farcaster !== 'undefined' && farcaster?.ready) {
          farcaster.ready();
          console.log('✅ Component: farcaster.ready() (global) called');
          sdkCalled = true;
        }
        
        // 4. READY MESAJI (her durumda)
        if (window.parent !== window) {
          const readyMsg = {
            type: 'ready',
            data: {
              version: '1.0.0',
              component: true,
              sdkCalled: sdkCalled,
              timestamp: Date.now()
            }
          };
          window.parent.postMessage(readyMsg, '*');
          console.log('📨 Component ready sent, SDK:', sdkCalled);
        }
        
        if (!sdkCalled) {
          console.log('🔍 Component: No SDK found for ready call');
        }
        
        return sdkCalled;
      } catch (error) {
        console.error('❌ Component ready error:', error);
        return false;
      }
    };

    // Hemen çalıştır
    performFinalReadyChecks();
    
    // 1 saniye sonra tekrar dene
    setTimeout(() => {
      console.log('🔄 Component: 1s re-check...');
      performFinalReadyChecks();
    }, 1000);
    
    // 3 saniye sonra final check
    setTimeout(() => {
      console.log('🔍 Component: 3s final check...');
      const finalResult = performFinalReadyChecks();
      if (!finalResult) {
        console.warn('⚠️ Component: SDK never available for ready call');
      }
    }, 3000);
    
  }, []);
  
  return null;
}