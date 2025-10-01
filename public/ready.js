(function() {
  console.log('🚀 YoYo Mini App - Calling sdk.actions.ready()');
  
  const farcasterReady = function() {
    try {
      // 1. YENİ SDK - sdk.actions.ready()
      if (window.farcaster && window.farcaster.actions) {
        window.farcaster.actions.ready();
        console.log('✅ sdk.actions.ready() called from ready.js');
      }
      // 2. ESKİ SDK - farcaster.ready()
      else if (typeof farcaster !== 'undefined') {
        farcaster.ready();
        console.log('✅ farcaster.ready() called from ready.js');
      }
      
      // 3. READY MESAJI
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'ready',
          version: '1.0.0',
          app: 'YoYo Guild Battle'
        }, '*');
        console.log('📨 Ready message sent');
      }
    } catch(e) {
      console.error('Ready error:', e);
    }
  };

  // ACİL - hemen çağır
  farcasterReady();
  
  // Farcaster yavaş yüklenebilir - çoklu deneme
  [50, 100, 200, 500, 1000, 2000, 3000, 5000].forEach(timeout => {
    setTimeout(farcasterReady, timeout);
  });
})();