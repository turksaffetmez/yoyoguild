(function() {
  console.log('🚀 YoYo Mini App - Final ready check');
  
  const finalReadyCheck = function() {
    try {
      // 1. SDK ready çağır (eğer varsa)
      let sdkCalled = false;
      
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
      
      // 2. Ready mesajı gönder (her zaman)
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'ready',
          version: '1.0.0',
          app: 'YoYo Guild Battle',
          readyjs: true,
          sdkCalled: sdkCalled,
          timestamp: Date.now()
        }, '*');
        console.log('📨 ready.js message sent, SDK called:', sdkCalled);
      }
      
      // 3. SDK yoksa uyarı
      if (!sdkCalled) {
        console.warn('⚠️ ready.js: No SDK found, using message only');
      }
    } catch(e) {
      console.error('ready.js error:', e);
    }
  };

  // Hemen çağır
  finalReadyCheck();
  
  // Multiple attempts (Farcaster yavaşlığı için)
  [100, 500, 1000, 2000, 3000].forEach(timeout => {
    setTimeout(finalReadyCheck, timeout);
  });
})();