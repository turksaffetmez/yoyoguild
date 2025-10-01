(function() {
  console.log('🚀 YoYo Mini App - Simple Ready');
  
  const sendSimpleReady = function() {
    try {
      // Basit ready mesajı
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'ready',
          data: {
            version: '1.0.0',
            app: 'YoYo Guild Battle'
          }
        }, '*');
        console.log('📨 Simple ready sent');
      }
    } catch(e) {
      console.error('Ready error:', e);
    }
  };

  // Hemen gönder
  sendSimpleReady();
  
  // 1 saniye sonra tekrar
  setTimeout(sendSimpleReady, 1000);
})();