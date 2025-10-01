// public/ready.js - BUNUNLA DEĞİŞTİRİN
(function() {
  console.log('🚀 ULTRA READY - YoYo Mini App');
  
  const ultraReady = function() {
    try {
      // 1. Ready mesajı
      const msg = { 
        type: 'ready', 
        version: '1.0.0',
        app: 'YoYo Guild Battle', 
        ultra: true,
        timestamp: Date.now()
      };
      
      if (window.parent !== window) {
        window.parent.postMessage(msg, '*');
        console.log('🚨 ULTRA READY SENT:', msg);
      }
      
      // 2. Farcaster SDK
      if (typeof window.farcaster !== 'undefined') {
        window.farcaster.ready();
        console.log('✅ farcaster.ready() called');
      }
      
      // 3. SPLASH KAPATMA
      document.querySelectorAll('iframe, [class*="splash"], [class*="loading"]').forEach(el => {
        el.remove();
      });
      document.body.style.visibility = 'visible';
      
    } catch (e) {
      console.error('Ultra ready error:', e);
    }
  };

  // ACİL - hemen çalıştır
  ultraReady();
  
  // Warpcast çok yavaş - çoklu deneme
  [10, 50, 100, 200, 500, 1000, 2000, 3000, 5000, 8000, 15000].forEach(timeout => {
    setTimeout(ultraReady, timeout);
  });

})();