(function() {
  console.log('🚀 YoYo Mini App - Waiting for Farcaster SDK');
  
  const initializeApp = function() {
    try {
      // SDK kontrolü
      let sdkCalled = false;
      
      // 1. YENİ SDK - sdk.actions.ready()
      if (window.farcaster && window.farcaster.actions) {
        window.farcaster.actions.ready();
        console.log('✅ sdk.actions.ready() called from ready.js');
        sdkCalled = true;
      }
      // 2. ESKİ SDK - farcaster.ready()
      else if (window.farcaster && window.farcaster.ready) {
        window.farcaster.ready();
        console.log('✅ farcaster.ready() called from ready.js');
        sdkCalled = true;
      }
      
      // 3. READY MESAJI (her zaman gönder)
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'ready',
          version: '1.0.0',
          app: 'YoYo Guild Battle',
          sdkReady: sdkCalled
        }, '*');
        console.log('📨 Ready message sent, SDK called:', sdkCalled);
      }
      
      // SDK yoksa uyarı
      if (!sdkCalled) {
        console.warn('⚠️ Farcaster SDK not available in ready.js');
      }
    } catch(e) {
      console.error('Ready error:', e);
    }
  };

  // Hemen dene
  initializeApp();
  
  // SDK yüklenmesi için çoklu deneme
  [100, 500, 1000, 2000, 3000, 5000, 8000].forEach(timeout => {
    setTimeout(initializeApp, timeout);
  });
})();