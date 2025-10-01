(function() {
  console.log('🚀 YoYo Mini App - Ultimate Ready Solution');
  
  const sendUltimateReady = function() {
    try {
      let sdkCalled = false;
      
      // 1. SDK READY ÇAĞIR (tüm formatlar)
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
      
      // 2. FARCASTER FORMATINDA READY MESAJI
      if (window.parent !== window) {
        const readyMsg = {
          type: 'ready',
          data: {
            version: '1.0.0',
            app: 'YoYo Guild Battle',
            readyjs: true,
            sdkCalled: sdkCalled,
            timestamp: Date.now()
          }
        };
        window.parent.postMessage(readyMsg, '*');
        console.log('📨 ready.js: Farcaster format ready sent, SDK:', sdkCalled);
      }
      
      // 3. SDK DURUMU
      if (!sdkCalled) {
        console.log('ℹ️ ready.js: No SDK available, using message-only approach');
        
        // SDK yoksa window object'i kontrol et
        console.log('🔍 Window objects:');
        console.log('- farcaster:', window.farcaster);
        console.log('- Farcaster:', window.Farcaster);
        console.log('- fc:', window.fc);
      }
    } catch(e) {
      console.error('❌ ready.js error:', e);
    }
  };

  // ACİL - hemen gönder
  sendUltimateReady();
  
  // Farcaster yavaşlığı için çoklu deneme
  const intervals = [100, 300, 600, 1000, 2000, 3000, 5000, 8000, 10000];
  intervals.forEach(timeout => {
    setTimeout(sendUltimateReady, timeout);
  });

  // 15 saniye sonra final attempt
  setTimeout(() => {
    console.log('🎯 ready.js: Final attempt after 15s');
    sendUltimateReady();
  }, 15000);
})();