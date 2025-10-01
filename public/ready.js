// public/ready.js - BU ŞEKİLDE OLSUN:
(function() {
  console.log('🚀 YoYo Mini App Loading...');
  
  // Mini App için ready mesajı
  const sendMiniAppReady = function() {
    try {
      // 1. Parent frame'e ready gönder
      if (window.parent !== window) {
        const msg = { 
          type: 'ready', 
          version: '1.0.0',
          app: 'YoYo Guild Battle',
          isMiniApp: true,
          timestamp: Date.now()
        };
        window.parent.postMessage(msg, '*');
        console.log('📨 Mini App Ready sent:', msg);
      }
      
      // 2. Farcaster SDK ready
      if (typeof window.farcaster !== 'undefined') {
        window.farcaster.ready();
        console.log('✅ farcaster.ready() called');
      }
    } catch(e) {
      console.error('Ready error:', e);
    }
  };

  // Hemen gönder
  sendMiniAppReady();
  
  // Warpcast yavaş yükleniyor, çoklu deneme
  [100, 500, 1000, 2000, 3000, 5000, 8000].forEach(timeout => {
    setTimeout(sendMiniAppReady, timeout);
  });
})();