// public/ready.js - BUNU DEĞİŞTİRİN
(function() {
  console.log('🚀 EMERGENCY READY FIX - YoYo Guild');
  
  // ACİL FIX: Hemen gönder
  const emergencyReady = function() {
    try {
      const msg = { 
        type: 'ready', 
        version: '1.0.0',
        app: 'YoYo Guild Battle',
        url: window.location.href,
        emergency: true,
        timestamp: Date.now()
      };
      
      // 1. Parent'a gönder (CRITICAL)
      if (window.parent !== window) {
        window.parent.postMessage(msg, '*');
        console.log('🚨 EMERGENCY READY SENT:', msg);
      }
      
      // 2. Farcaster SDK
      if (typeof window.farcaster !== 'undefined') {
        window.farcaster.ready();
        console.log('✅ farcaster.ready() called');
      }
      
    } catch (e) {
      console.error('Ready error:', e);
    }
  };

  // ACİL: Hemen çalıştır
  emergencyReady();
  
  // Farcaster'ın yavaşlığı için çoklu deneme
  [10, 50, 100, 200, 500, 1000, 2000, 3000, 5000, 8000, 10000, 15000].forEach(timeout => {
    setTimeout(emergencyReady, timeout);
  });

})();