// public/ready.js - Base App için CRITICAL!
(function() {
  console.log('🚀 IMMEDIATE READY CALL - Base App');
  
  if (window.parent !== window.self) {
    // HEMEN gönder - 0ms delay
    const readyMsg = {
      type: 'ready',
      version: '1.0.0',
      app: 'YoYo Guild Battle',
      timestamp: Date.now(),
      source: 'immediate-script'
    };
    
    window.parent.postMessage(readyMsg, '*');
    console.log('📨 IMMEDIATE ready sent from ready.js');
    
    // 100ms sonra tekrar
    setTimeout(() => {
      window.parent.postMessage(readyMsg, '*');
      console.log('📨 Second ready (100ms)');
    }, 100);
    
    // 500ms sonra tekrar  
    setTimeout(() => {
      window.parent.postMessage(readyMsg, '*');
      console.log('📨 Third ready (500ms)');
    }, 500);
  }
})();