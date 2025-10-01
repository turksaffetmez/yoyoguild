(function() {
  console.log('🚀 YoYo Mini App - Simplified Ready');
  
  const sendReady = function() {
    try {
      // Basit ready mesajı - SDK olmasa bile
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'ready',
          version: '1.0.0', 
          app: 'YoYo Guild Battle',
          simplified: true,
          timestamp: Date.now()
        }, '*');
        console.log('📨 Simplified ready message sent');
      }
      
      // SDK varsa kullan
      if (window.farcaster?.actions?.ready) {
        window.farcaster.actions.ready();
        console.log('✅ sdk.actions.ready() called');
      }
      else if (window.farcaster?.ready) {
        window.farcaster.ready();
        console.log('✅ farcaster.ready() called');
      }
    } catch(e) {
      console.error('Ready error:', e);
    }
  };

  // Hemen gönder
  sendReady();
  
  // Multiple attempts
  [100, 500, 1000, 2000].forEach(timeout => {
    setTimeout(sendReady, timeout);
  });
})();