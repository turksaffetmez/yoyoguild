(function() {
  console.log('🚀 YoYo Mini App - Farcaster Format Ready');
  
  const sendFarcasterReady = function() {
    try {
      // 1. Önce SDK'yı dene
      let sdkCalled = false;
      
      // Tüm olası SDK formatları
      if (window.farcaster?.actions?.ready) {
        window.farcaster.actions.ready();
        console.log('✅ ready.js: sdk.actions.ready() called');
        sdkCalled = true;
      }
      else if (window.farcaster?.ready) {
        window.farcaster.ready();
        console.log('✅ ready.js: farcaster.ready() called');
        sdkCalled = true;
      }
      else if (typeof farcaster !== 'undefined' && farcaster?.ready) {
        farcaster.ready();
        console.log('✅ ready.js: farcaster.ready() (global) called');
        sdkCalled = true;
      }
      
      // 2. Farcaster formatında ready mesajı gönder
      if (window.parent !== window) {
        const readyMsg = {
          type: 'ready',
          data: {
            version: '1.0.0',
            sdk: sdkCalled
          }
        };
        window.parent.postMessage(readyMsg, '*');
        console.log('📨 Farcaster format ready sent, SDK:', sdkCalled);
      }
      
      // 3. SDK yoksa uyarı
      if (!sdkCalled) {
        console.warn('⚠️ ready.js: No SDK found');
      }
    } catch(e) {
      console.error('ready.js error:', e);
    }
  };

  // Hemen gönder
  sendFarcasterReady();
  
  // Multiple attempts
  [100, 500, 1000, 2000, 3000, 5000].forEach(timeout => {
    setTimeout(sendFarcasterReady, timeout);
  });
})();