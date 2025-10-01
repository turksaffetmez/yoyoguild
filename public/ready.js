// public/ready.js - GÜNCELLEYİN
(function() {
  console.log('🚀 YoYo Guild Battle Loading...');
  
  const isLaunchFrame = window.location.href.includes('launchFrameUrl');
  const isMiniApp = window.parent !== window && !isLaunchFrame;
  
  if (isMiniApp) {
    // Gerçek Mini App - ready gönder
    const msg = { type: 'ready', version: '1.0.0', app: 'YoYo Guild Battle' };
    window.parent.postMessage(msg, '*');
    console.log('📨 Mini App Ready sent');
    
    // Farcaster SDK
    if (window.farcaster) {
      window.farcaster.ready();
    }
  } else if (isLaunchFrame) {
    // Launch Frame - sadece içeriği göster
    console.log('🎯 Launch Frame Mode - Showing content');
    document.body.style.visibility = 'visible';
  } else {
    // Normal web - sadece içeriği göster
    console.log('🌐 Normal Web Mode');
  }
})();